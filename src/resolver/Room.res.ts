import { Arg, Int, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BedRepository } from "../repository/Bed.rep";
import { HospitalRepository } from "../repository/Hospital.rep";
import { RoomRepository } from "../repository/Room.rep";

@Service()
@Resolver()
export class RoomResolver {
	constructor(
		@InjectRepository() private readonly hospitalRepo: HospitalRepository,
		@InjectRepository() private readonly roomRepo: RoomRepository,
		@InjectRepository() private readonly bedRepo: BedRepository
	) {}

	@Mutation(() => Boolean)
	async addRoom(
		@Arg("hospitalId", () => String) hospitalId: string,
		@Arg("roomNo", () => Int) roomNo: number
	): Promise<boolean> {
		await this.hospitalRepo.isDef(hospitalId);
		await this.roomRepo.isNotDef(roomNo, hospitalId);
		await this.roomRepo.insert({ hospitalId, roomNo });
		return true;
	}

	@Mutation(() => Boolean)
	async addBed(
		@Arg("hospitalId", () => String) hospitalId: string,
		@Arg("roomNo", () => Int) roomNo: number,
		@Arg("bedNo", () => Int) bedNo: number
	): Promise<boolean> {
		await this.hospitalRepo.isDef(hospitalId);
		await this.roomRepo.isDef(roomNo, hospitalId);
		await this.bedRepo.isNotDef(bedNo, roomNo, hospitalId);
		await this.bedRepo.insert({ bedNo, roomNo, hospitalId });
		return true;
	}
}
