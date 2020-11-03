import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BedRepository } from "../repository/Bed.rep";
import { BedRegisterRepository } from "../repository/BedRegister.rep";
import { HospRegisterRepository } from "../repository/HospRegister.rep";
import { PatientRepository } from "../repository/Patient.rep";
import { RoomRepository } from "../repository/Room.rep";
import { TestResultRepository } from "../repository/TestResult.rep";
import { perfectCtx, TestReasons, UserRoles } from "../service/customTypes";

@Service()
@Resolver()
export class StaffResolver {
	constructor(
		@InjectRepository() private readonly bedRepo: BedRepository,
		@InjectRepository() private readonly roomRepo: RoomRepository,
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly testResultRepo: TestResultRepository,
		@InjectRepository() private readonly bedRegisterRepo: BedRegisterRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository
	) {}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.STAFF)
	async addRoom(
		@Ctx() { req }: perfectCtx,
		@Arg("roomNo", () => Int) roomNo: number
	): Promise<boolean> {
		const { hospitalId } = await this.hospRegisterRepo.isDef(req.session.userId);
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
		await this.roomRepo.isDef(roomNo, hospitalId);
		await this.bedRepo.isNotDef(bedNo, roomNo, hospitalId);
		await this.bedRepo.insert({ bedNo, roomNo, hospitalId });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.STAFF)
	async publishTestResult(
		@Ctx() { req }: perfectCtx,
		@Arg("patientId", () => String) patientId: string,
		@Arg("reason", () => TestReasons) reason: TestReasons,
		@Arg("description", () => String, { nullable: true }) description?: string
	): Promise<boolean> {
		await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		await this.patientRepo.isDef(patientId);
		await this.testResultRepo.isNotDef(patientId);
		await this.testResultRepo.insert({ patientId, reason, description });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.STAFF)
	async assignBed(
		@Ctx() { req }: perfectCtx,
		@Arg("roomNo", () => Int) roomNo: number,
		@Arg("bedNo", () => Int) bedNo: number,
		@Arg("patientId", () => String) patientId: string
	): Promise<Boolean> {
		await this.patientRepo.isDef(patientId);
		const hospitalId = await this.hospRegisterRepo.areInSameHosp(
			req.session.userId,
			patientId
		);
		await this.roomRepo.isDef(roomNo, hospitalId);
		await this.bedRepo.isDef(bedNo, roomNo, hospitalId);
		await this.bedRegisterRepo.isNotDef(bedNo, roomNo, hospitalId, patientId);
		await this.bedRegisterRepo.insert({ bedNo, roomNo, hospitalId, patientId });
		return true;
	}
}
