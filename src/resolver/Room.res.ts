import { Arg, Int, Mutation, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Hospital } from "../entity/Hospital.ent";
import { Room } from "../entity/Room.ent";

@Resolver()
export class RoomResolver {
	@Mutation(() => Boolean)
	async addRoom(
		@Arg("hospitalId", () => String) hospitalId: string,
		@Arg("roomNo", () => Int) roomNo: number
	): Promise<boolean> {
		const hospital = await getRepository(Hospital).findOne({
			where: { id: hospitalId },
		});
		if (hospital === undefined) throw new Error("Invalid Hospital Provided");

		const [, checkRoom] = await getRepository(Room).findAndCount({
			where: { hospitalId: hospital.id, roomNo },
		});
		if (checkRoom > 0) throw new Error("Room already created");

		await getRepository(Room).save(
			getRepository(Room).create({ belongsTo: hospital, roomNo })
		);
		return true;
	}
}
