import { hash } from "argon2";
import { Mutation, Resolver } from "type-graphql";
import { createQueryBuilder, getRepository } from "typeorm";
import { Patient } from "../entity/Patient.ent";
import { User, userRoles } from "../entity/User.ent";
import { userNotDef } from "../middleware/isNotDefined.mid";
import { ArgKey, ValidateArgs } from "../service/customTypes";
import { PatientInput } from "../input/Patient.inp";
import { UserInput } from "../input/User.inp";

@Resolver()
export class PatientResolver {
	@Mutation(() => Boolean)
	@ValidateArgs([userNotDef])
	async registerPatient(
		@ArgKey("user", () => UserInput) { password, ...userInp }: UserInput,
		@ArgKey("patient", () => PatientInput) patientInp: PatientInput
	): Promise<boolean> {
		const hashPassword = await hash(password);
		const user = getRepository(User).create({
			...userInp,
			hashPassword,
			role: userRoles.PATIENT,
		});
		await getRepository(User).save(user);

		await createQueryBuilder()
			.insert()
			.into(Patient)
			.values({ ...patientInp, user })
			.execute();
		return true;
	}
}
