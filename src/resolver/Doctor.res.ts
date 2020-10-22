import { hash } from "argon2";
import { Mutation, Resolver } from "type-graphql";
import { createQueryBuilder, getRepository } from "typeorm";
import { Appointment } from "../entity/Appointment.ent";
import { Doctor } from "../entity/Doctor.ent";
import { User, userRoles } from "../entity/User.ent";
import { doctorDef, patientDef } from "../middleware/isDefined.mid";
import { appointmentNotDef, userNotDef } from "../middleware/isNotDefined.mid";
import { ArgKey, ValidateArgs } from "../service/customTypes";
import { DoctorInput } from "../input/Doctor.inp";
import { UserInput } from "../input/User.inp";

@Resolver()
export class PatientResolver {
	@Mutation(() => Boolean)
	@ValidateArgs([userNotDef])
	async registerDoctor(
		@ArgKey("user", () => UserInput) { password, ...userInp }: UserInput,
		@ArgKey("doctor", () => DoctorInput) doctorInp: DoctorInput
	): Promise<boolean> {
		const hashPassword = await hash(password);
		const user = getRepository(User).create({
			...userInp,
			hashPassword,
			role: userRoles.DOCTOR,
		});
		await getRepository(User).save(user);

		await createQueryBuilder()
			.insert()
			.into(Doctor)
			.values({ ...doctorInp, user })
			.execute();
		return true;
	}

	@Mutation(() => Boolean)
	@ValidateArgs([doctorDef, patientDef, appointmentNotDef])
	async createAppointment(
		@ArgKey("doctorId", () => String) doctorId: string,
		@ArgKey("patientId", () => String) patientId: string
	): Promise<boolean> {
		await createQueryBuilder()
			.insert()
			.into(Appointment)
			.values({ doctorId, patientId })
			.execute();
		return true;
	}
}
