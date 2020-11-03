import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { AppointmentRepository } from "../repository/Appointment.rep";
import { HospRegisterRepository } from "../repository/HospRegister.rep";
import { MedicineRepository } from "../repository/Medicine.rep";
import { PatientRepository } from "../repository/Patient.rep";
import { PrescribedMedRepository } from "../repository/PrescribedMed.rep";
import { perfectCtx, UserRoles } from "../service/customTypes";

@Service()
@Resolver()
export class DoctorResolver {
	constructor(
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly medicineRepo: MedicineRepository,
		@InjectRepository() private readonly appointmentRepo: AppointmentRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository,
		@InjectRepository() private readonly prescribedMedRepo: PrescribedMedRepository
	) {}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.DOCTOR)
	async createAppointment(
		@Ctx() { req }: perfectCtx,
		@Arg("patientId", () => String) patientId: string
	): Promise<boolean> {
		await this.patientRepo.isDef(patientId);
		await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		await this.appointmentRepo.isNotDef(req.session.userId, patientId);
		await this.appointmentRepo.insert({ doctorId: req.session.userId, patientId });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.DOCTOR)
	async prescribeMedicines(
		@Ctx() { req }: perfectCtx,
		@Arg("patientId", () => String) patientId: string,
		@Arg("medicines", () => [String]) medicineNames: string[]
	): Promise<boolean> {
		await this.patientRepo.isDef(patientId);
		await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		for (let medName of medicineNames) {
			await this.medicineRepo.isDef(medName);
			await this.prescribedMedRepo.isNotDef(patientId, medName);
			await this.prescribedMedRepo.insert({ patientId, medName });
		}
		return true;
	}
}
