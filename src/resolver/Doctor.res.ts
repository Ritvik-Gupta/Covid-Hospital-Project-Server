import { hash } from "argon2";
import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getRepository } from "typeorm";
import { Appointment } from "../entity/Appointment.ent";
import { Doctor } from "../entity/Doctor.ent";
import { User, userRoles } from "../entity/User.ent";
import { keys } from "../service/customTypes";
import { DoctorInput } from "./input/Doctor.inp";
import { UserInput } from "./input/User.inp";
import { doctorDef, patientDef } from "./middleware/isDefined.mid";
import { appointmentNotDef, userNotDef } from "./middleware/isNotDefined.mid";

@Resolver()
export class PatientResolver {
	@Mutation(() => Boolean)
	@UseMiddleware(userNotDef)
	async registerDoctor(
		@Arg(keys.user, () => UserInput) { password, ...userInp }: UserInput,
		@Arg(keys.doctor, () => DoctorInput) doctorInp: DoctorInput
	): Promise<boolean> {
		const hashPassword = await hash(password);
		const user = getRepository(User).create({
			...userInp,
			hashPassword,
			role: userRoles.DOCTOR,
		});
		await getRepository(User).save(user);

		await getRepository(Doctor).save(
			getRepository(Doctor).create({ ...doctorInp, user })
		);
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(doctorDef, patientDef, appointmentNotDef)
	async createAppointment(
		@Arg(keys.doctorId, () => String) doctorId: string,
		@Arg(keys.patientId, () => String) patientId: string
	): Promise<boolean> {
		await getRepository(Appointment).save(
			getRepository(Appointment).create({ doctorId, patientId })
		);
		return true;
	}
}
