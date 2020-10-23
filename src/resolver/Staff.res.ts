import { Arg, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { userRoles } from "../entity/User.ent";
import { PatientInput } from "../input/Patient.inp";
import { UserInput } from "../input/User.inp";
import { StaffRepository } from "../repository/Staff.rep";
import { UserRepository } from "../repository/User.rep";

@Service()
@Resolver()
export class StaffResolver {
	constructor(
		@InjectRepository() private readonly userRepo: UserRepository,
		@InjectRepository() private readonly staffRepo: StaffRepository
	) {}

	@Mutation(() => Boolean)
	async registerPatient(
		@Arg("user", () => UserInput) userInp: UserInput,
		@Arg("patient", () => PatientInput) patientInp: PatientInput
	): Promise<boolean> {
		await this.userRepo.isNotDef(userInp.email);
		const user = await this.userRepo.createAndReturn(userInp, userRoles.PATIENT);
		await this.staffRepo.insert({ ...patientInp, user });
		return true;
	}
}
