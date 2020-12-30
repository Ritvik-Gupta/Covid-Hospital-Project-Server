import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { HospRegisterRepository, PatientRepository } from "../repository";
import { UserRoles } from "../service/customEnums";
import { perfectCtx } from "../service/customTypes";

@Service()
@Resolver()
export class PatientResolver {
	constructor(
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository
	) {}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.PATIENT)
	async visitHospital(
		@Ctx() { req }: perfectCtx,
		@Arg("hospitalId", () => String) hospitalId: string
	): Promise<boolean> {
		await this.patientRepo.ifDefined({ userId: req.session.userId });
		await this.hospRegisterRepo.ifNotDefined({ userId: req.session.userId });
		await this.hospRegisterRepo.create({ hospitalId, userId: req.session.userId });
		return true;
	}
}
