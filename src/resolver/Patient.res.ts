import { Arg, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { userRoles } from "../service/customTypes";
import { PatientInput } from "../input/Patient.inp";
import { UserInput } from "../input/User.inp";
import { PatientRepository } from "../repository/Patient.rep";
import { UserRepository } from "../repository/User.rep";

@Service()
@Resolver()
export class PatientResolver {
	constructor(
		@InjectRepository() private readonly userRepo: UserRepository,
		@InjectRepository() private readonly patientRepo: PatientRepository
	) {}

	@Mutation(() => Boolean)
	async registerPatient(
		@Arg("user", () => UserInput) userInp: UserInput,
		@Arg("patient", () => PatientInput) patientInp: PatientInput
	): Promise<boolean> {
		await this.userRepo.isNotDef(userInp.email);
		const user = await this.userRepo.createAndReturn(userInp, userRoles.PATIENT);
		await this.patientRepo.insert({ ...patientInp, user });
		return true;
	}
}
