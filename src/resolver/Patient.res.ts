import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { HospRegisterRepository } from "../entity/HospRegister.ent";
import { PatientRepository } from "../entity/Patient.ent";
import { perfectCtx, UserRoles } from "../service/customTypes";

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
		await this.patientRepo.isDef({ userId: req.session.userId });
		await this.hospRegisterRepo.isNotDef({ userId: req.session.userId });
		await this.hospRegisterRepo.create({ hospitalId, userId: req.session.userId });
		return true;
	}
}
