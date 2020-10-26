import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { AppointmentRepository } from "../repository/Appointment.rep";
import { DoctorRepository } from "../repository/Doctor.rep";
import { HospRegisterRepository } from "../repository/HospRegister.rep";
import { PatientRepository } from "../repository/Patient.rep";
import { perfectCtx, UserRoles } from "../service/customTypes";

@Service()
@Resolver()
export class DoctorResolver {
	constructor(
		@InjectRepository() private readonly doctorRepo: DoctorRepository,
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly appointmentRepo: AppointmentRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository
	) {}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.DOCTOR)
	async createAppointment(
		@Ctx() { req }: perfectCtx,
		@Arg("patientId", () => String) patientId: string
	): Promise<boolean> {
		await this.patientRepo.isDef(patientId);
		await this.doctorRepo.isDef(req.session.userId);
		await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		await this.appointmentRepo.isNotDef(req.session.userId, patientId);
		await this.appointmentRepo.insert({ doctorId: req.session.userId, patientId });
		return true;
	}
}
