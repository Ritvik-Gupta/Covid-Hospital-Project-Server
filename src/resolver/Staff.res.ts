import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { HospRegisterRepository } from "../repository/HospRegister.rep";
import { PatientRepository } from "../repository/Patient.rep";
import { TestResultRepository } from "../repository/TestResult.rep";
import { perfectCtx, TestReasons, UserRoles } from "../service/customTypes";

@Service()
@Resolver()
export class StaffResolver {
	constructor(
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly testResultRepo: TestResultRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository
	) {}

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
}
