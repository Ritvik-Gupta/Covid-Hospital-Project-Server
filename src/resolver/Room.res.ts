import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BedRepository } from "../repository/Bed.rep";
import { HospitalRepository } from "../repository/Hospital.rep";
import { HospRegisterRepository } from "../repository/HospRegister.rep";
import { RoomRepository } from "../repository/Room.rep";
import { perfectCtx, UserRoles } from "../service/customTypes";

@Service()
@Resolver()
export class RoomResolver {
	constructor(
		@InjectRepository() private readonly bedRepo: BedRepository,
		@InjectRepository() private readonly roomRepo: RoomRepository,
		@InjectRepository() private readonly hospitalRepo: HospitalRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository
	) {}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.STAFF)
	async addRoom(
		@Ctx() { req }: perfectCtx,
		@Arg("roomNo", () => Int) roomNo: number
	): Promise<boolean> {
		const { hospitalId } = await this.hospRegisterRepo.isDef(req.session.userId);
		await this.hospitalRepo.isDef(hospitalId);
		await this.roomRepo.isNotDef(roomNo, hospitalId);
		await this.roomRepo.insert({ hospitalId, roomNo });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.STAFF)
	async addBed(
		@Ctx() { req }: perfectCtx,
		@Arg("roomNo", () => Int) roomNo: number,
		@Arg("bedNo", () => Int) bedNo: number
	): Promise<boolean> {
		const { hospitalId } = await this.hospRegisterRepo.isDef(req.session.userId);
		await this.hospitalRepo.isDef(hospitalId);
		await this.roomRepo.isDef(roomNo, hospitalId);
		await this.bedRepo.isNotDef(bedNo, roomNo, hospitalId);
		await this.bedRepo.insert({ bedNo, roomNo, hospitalId });
		return true;
	}
}
