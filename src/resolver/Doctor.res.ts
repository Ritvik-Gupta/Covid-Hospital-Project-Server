import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { AppointmentRepository } from "../entity/Appointment.ent";
import { CovidRegisterRepository } from "../entity/CovidRegister.ent";
import { HospRegisterRepository } from "../entity/HospRegister.ent";
import { MedicineRepository } from "../entity/Medicine.ent";
import { PatientRepository } from "../entity/Patient.ent";
import { PrescribedMedRepository } from "../entity/PrescribedMed.ent";
import { CovidEntry, perfectCtx, UserRoles } from "../service/customTypes";

@Service()
@Resolver()
export class DoctorResolver {
	constructor(
		@InjectRepository() private readonly patientRepo: PatientRepository,
		@InjectRepository() private readonly medicineRepo: MedicineRepository,
		@InjectRepository() private readonly appointmentRepo: AppointmentRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository,
		@InjectRepository() private readonly prescribedMedRepo: PrescribedMedRepository,
		@InjectRepository() private readonly covidRegisterRepo: CovidRegisterRepository
	) {}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.DOCTOR)
	async createAppointment(
		@Ctx() { req }: perfectCtx,
		@Arg("patientId", () => String) patientId: string
	): Promise<boolean> {
		await this.patientRepo.isDef({ userId: patientId });
		await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		await this.appointmentRepo.isNotDef({ doctorId: req.session.userId, patientId });
		await this.appointmentRepo.create({ doctorId: req.session.userId, patientId });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.DOCTOR)
	async prescribeMedicines(
		@Ctx() { req }: perfectCtx,
		@Arg("patientId", () => String) patientId: string,
		@Arg("medicines", () => [String]) medicineNames: string[]
	): Promise<boolean> {
		await this.patientRepo.isDef({ userId: patientId });
		await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		for (const medicineName of medicineNames) {
			await this.medicineRepo.isDef({ name: medicineName });
			await this.prescribedMedRepo.isNotDef({ patientId, medicineName });
			await this.prescribedMedRepo.create({ patientId, medicineName });
		}
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.DOCTOR)
	async addCovidRecord(
		@Ctx() { req }: perfectCtx,
		@Arg("patientId", () => String) patientId: string,
		@Arg("entry", () => CovidEntry) entry: CovidEntry
	): Promise<boolean> {
		if (entry === CovidEntry.AFFECTED) throw new Error("No Patient Test Results Found");
		await this.patientRepo.isDef({ userId: patientId });
		const hospitalId = await this.hospRegisterRepo.areInSameHosp(req.session.userId, patientId);
		await this.covidRegisterRepo.checkLastRecord(patientId, CovidEntry.AFFECTED);
		await this.covidRegisterRepo.create({ patientId, hospitalId, entry });
		return true;
	}
}
