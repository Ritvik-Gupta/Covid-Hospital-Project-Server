import { hash } from "argon2";
import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getRepository } from "typeorm";
import { Patient } from "../entity/Patient.ent";
import { User, userRoles } from "../entity/User.ent";
import { keys } from "../service/customTypes";
import { PatientInput } from "./input/Patient.inp";
import { UserInput } from "./input/User.inp";
import { userNotDef } from "./middleware/isNotDefined.mid";

@Resolver()
export class PatientResolver {
	@Mutation(() => Boolean)
	@UseMiddleware(userNotDef)
	async registerPatient(
		@Arg(keys.user, () => UserInput) { password, ...userInp }: UserInput,
		@Arg(keys.patient, () => PatientInput) patientInp: PatientInput
	): Promise<boolean> {
		const hashPassword = await hash(password);
		const user = getRepository(User).create({
			...userInp,
			hashPassword,
			role: userRoles.PATIENT,
		});
		await getRepository(User).save(user);

		await getRepository(Patient).save(
			getRepository(Patient).create({ ...patientInp, user })
		);
		return true;
	}
}
