import { Arg, Int, Mutation, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Bed } from "../entity/Bed.entity";
import { Hospital } from "../entity/Hospital.entity";
import { Room } from "../entity/Room.entity";

@Resolver()
export class BedResolver {
	@Mutation(() => Boolean)
	async addBed(
		@Arg("hospitalId", () => String) hospitalId: string,
		@Arg("roomNo", () => Int) roomNo: number,
		@Arg("bedNo", () => Int) bedNo: number
	): Promise<boolean> {
		const hospital = await getRepository(Hospital).findOne({
			where: { id: hospitalId },
		});
		if (hospital === undefined) throw new Error("Invalid Hospital Provided");

		const room = await getRepository(Room).findOne({
			where: { belongsTo: hospital, roomNo },
		});
		if (room === undefined) throw new Error("Invalid Room Provided");

		const [, checkBed] = await getRepository(Bed).findAndCount({
			where: { bedNo, roomNo: room.roomNo, hospitalId: room.hospitalId },
		});
		if (checkBed > 0) throw new Error("Bed already created");

		await getRepository(Bed).save(
			getRepository(Bed).create({ bedNo, inRoom: room })
		);
		return true;
	}
}
