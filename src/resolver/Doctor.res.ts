import { hash } from "argon2";
import { Arg, Mutation, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Doctor } from "../entity/Doctor.ent";
import { User, userRoles } from "../entity/User.ent";
import { DoctorInput } from "./input/Doctor.inp";

@Resolver()
export class DoctorResolver {
	@Mutation(() => Boolean)
	async registerDoctor(
		@Arg("doctor", () => DoctorInput) doctorInput: DoctorInput
	): Promise<boolean> {
		const [, userCount] = await getRepository(User).findAndCount({
			where: { email: doctorInput.email },
		});
		if (userCount > 0) throw new Error("User Already Registered with the Email");

		const hashPassword = await hash(doctorInput.password);
		const user = getRepository(User).create({
			firstName: doctorInput.firstName,
			middleName: doctorInput.middleName,
			lastName: doctorInput.lastName,
			email: doctorInput.email,
			role: userRoles.DOCTOR,
			hashPassword,
		});
		await getRepository(User).save(user);

		const doctor = getRepository(Doctor).create({
			state: doctorInput.state,
			city: doctorInput.city,
			pincode: doctorInput.pincode,
			user,
		});
		await getRepository(Doctor).save(doctor);
		return true;
	}
}
