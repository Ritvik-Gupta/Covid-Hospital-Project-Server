import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { AppointmentRepository } from "../repository/Appointment.rep";
import { DoctorRepository } from "../repository/Doctor.rep";
import { PatientRepository } from "../repository/Patient.rep";
import { userRoles } from "../service/customTypes";

@Service()
@Resolver()
export class DoctorResolver {
	constructor(
		@InjectRepository() private readonly doctorRepo: DoctorRepository,
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly appointmentRepo: AppointmentRepository
	) {}

	@Mutation(() => Boolean)
	@Authorized(userRoles.DOCTOR)
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
