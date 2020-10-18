import { hash } from "argon2";
import { Arg, Mutation, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Patient } from "../entity/Patient.ent";
import { User, userRoles } from "../entity/User.ent";
import { PatientInput } from "./input/Patient.inp";

@Resolver()
export class PatientResolver {
	@Mutation(() => Boolean)
	async registerPatient(
		@Arg("patient", () => PatientInput) patientInput: PatientInput
	): Promise<boolean> {
		const [, userCount] = await getRepository(User).findAndCount({
			where: { email: patientInput.email },
		});
		if (userCount > 0) throw new Error("User Already Registered with the Email");

		const hashPassword = await hash(patientInput.password);
		const user = getRepository(User).create({
			firstName: patientInput.firstName,
			middleName: patientInput.middleName,
			lastName: patientInput.lastName,
			email: patientInput.email,
			role: userRoles.PATIENT,
			hashPassword,
		});
		await getRepository(User).save(user);

		const patient = getRepository(Patient).create({
			state: patientInput.state,
			city: patientInput.city,
			pincode: patientInput.pincode,
			user,
		});
		await getRepository(Patient).save(patient);
		return true;
	}
}
