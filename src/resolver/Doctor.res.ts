import { Arg, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { userRoles } from "../service/customTypes";
import { DoctorInput } from "../input/Doctor.inp";
import { UserInput } from "../input/User.inp";
import { AppointmentRepository } from "../repository/Appointment.rep";
import { DoctorRepository } from "../repository/Doctor.rep";
import { PatientRepository } from "../repository/Patient.rep";
import { UserRepository } from "../repository/User.rep";

@Service()
@Resolver()
export class DoctorResolver {
	constructor(
		@InjectRepository() private readonly userRepo: UserRepository,
		@InjectRepository() private readonly doctorRepo: DoctorRepository,
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly appointmentRepo: AppointmentRepository
	) {}

	@Mutation(() => Boolean)
	async registerDoctor(
		@Arg("user", () => UserInput) userInp: UserInput,
		@Arg("doctor", () => DoctorInput) doctorInp: DoctorInput
	): Promise<boolean> {
		await this.userRepo.isNotDef(userInp.email);
		const user = await this.userRepo.createAndReturn(userInp, userRoles.DOCTOR);
		await this.doctorRepo.insert({ ...doctorInp, user });
		return true;
	}

	@Mutation(() => Boolean)
	async createAppointment(
		@Arg("doctorId", () => String) doctorId: string,
		@Arg("patientId", () => String) patientId: string
	): Promise<boolean> {
		await this.doctorRepo.isDef(doctorId);
		await this.patientRepo.isDef(patientId);
		await this.appointmentRepo.isNotDef(doctorId, patientId);
		await this.appointmentRepo.insert({ doctorId, patientId });
		return true;
	}
}
