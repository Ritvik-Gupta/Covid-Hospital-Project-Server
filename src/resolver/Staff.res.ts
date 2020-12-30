import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
	BedRegisterRepository,
	BedRepository,
	CovidRegisterRepository,
	HospRegisterRepository,
	PatientRepository,
	RoomRepository,
	TestResultRepository,
} from "../repository";
import { TestReasons, UserRoles } from "../service/customEnums";
import { perfectCtx } from "../service/customTypes";

@Service()
@Resolver()
export class StaffResolver {
	constructor(
		@InjectRepository() private readonly bedRepo: BedRepository,
		@InjectRepository() private readonly roomRepo: RoomRepository,
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly testResultRepo: TestResultRepository,
		@InjectRepository() private readonly bedRegisterRepo: BedRegisterRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository,
		@InjectRepository() private readonly covidRegisterRepo: CovidRegisterRepository
	) {}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.STAFF)
	async addRoom(
		@Ctx() { req }: perfectCtx,
		@Arg("roomNo", () => Int) roomNo: number
	): Promise<boolean> {
		const { hospitalId } = await this.hospRegisterRepo.ifDefined({ userId: req.session.userId });
		await this.roomRepo.ifNotDefined({ roomNo, hospitalId });
		await this.roomRepo.create({ roomNo, hospitalId });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.STAFF)
	async addBed(
		@Ctx() { req }: perfectCtx,
		@Arg("roomNo", () => Int) roomNo: number,
		@Arg("bedNo", () => Int) bedNo: number
	): Promise<boolean> {
		const { hospitalId } = await this.hospRegisterRepo.ifDefined({ userId: req.session.userId });
		await this.roomRepo.ifDefined({ roomNo, hospitalId });
		await this.bedRepo.ifNotDefined({ bedNo, roomNo, hospitalId });
		await this.bedRepo.create({ bedNo, roomNo, hospitalId });
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
		await this.patientRepo.ifDefined({ userId: patientId });
		const hospitalId = await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		await this.testResultRepo.ifNotDefined({ patientId });
		await this.testResultRepo.create({ patientId, reason, description });
		if (reason === TestReasons.COVID)
			await this.covidRegisterRepo.addAffectedRecord(patientId, hospitalId);
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
		await this.patientRepo.ifDefined({ userId: patientId });
		const hospitalId = await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		await this.roomRepo.ifDefined({ roomNo, hospitalId });
		await this.bedRepo.ifDefined({ bedNo, roomNo, hospitalId });
		await this.bedRegisterRepo.ifNotDefined({ bedNo, roomNo, hospitalId, patientId });
		await this.bedRegisterRepo.create({ bedNo, roomNo, hospitalId, patientId });
		return true;
	}
}
