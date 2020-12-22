import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { DoctorRepository } from "../entity/Doctor.ent";
import { Hospital, HospitalInput, HospitalRepository } from "../entity/Hospital.ent";
import { HospRegisterRepository } from "../entity/HospRegister.ent";
import { MedicineInput, MedicineRepository } from "../entity/Medicine.ent";
import { StaffRepository } from "../entity/Staff.ent";
import { perfectCtx, UserRoles } from "../service/customTypes";
import { FieldPath, normalizedFieldPaths } from "../service/normalizeInfo";

@Service()
@Resolver()
export class AdminResolver {
	constructor(
		@InjectRepository() private readonly staffRepo: StaffRepository,
		@InjectRepository() private readonly doctorRepo: DoctorRepository,
		@InjectRepository() private readonly hospitalRepo: HospitalRepository,
		@InjectRepository() private readonly medicineRepo: MedicineRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository
	) {}

	@Query(() => [Hospital])
	@Authorized(UserRoles.ADMIN)
	ownsHospitals(
		@Ctx() { req }: perfectCtx,
		@FieldPath() fieldPath: normalizedFieldPaths
	): Promise<Hospital[]> {
		return this.hospitalRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.adminId = :adminId`, { adminId: req.session.userId })
			.getMany();
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.ADMIN)
	async addHospital(
		@Ctx() { req }: perfectCtx,
		@Arg("hospital", () => HospitalInput) hospInp: HospitalInput
	): Promise<boolean> {
		await this.hospitalRepo.ifNotDefined({ name: hospInp.name });
		await this.hospitalRepo.create({ ...hospInp, adminId: req.session.userId });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.ADMIN)
	async addMedicine(@Arg("medicine", () => MedicineInput) medInp: MedicineInput): Promise<boolean> {
		await this.medicineRepo.ifNotDefined({ name: medInp.name });
		await this.medicineRepo.create(medInp);
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.ADMIN)
	async hireStaff(
		@Ctx() { req }: perfectCtx,
		@Arg("hospitalId", () => String) hospitalId: string,
		@Arg("staffId", () => String) userId: string
	): Promise<boolean> {
		await this.hospitalRepo.checkAdmin(hospitalId, req.session.userId);
		await this.staffRepo.ifDefined({ userId });
		await this.hospRegisterRepo.ifNotDefined({ userId });
		await this.hospRegisterRepo.create({ hospitalId, userId });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.ADMIN)
	async hireDoctor(
		@Ctx() { req }: perfectCtx,
		@Arg("hospitalId", () => String) hospitalId: string,
		@Arg("doctorId", () => String) userId: string
	): Promise<boolean> {
		await this.hospitalRepo.checkAdmin(hospitalId, req.session.userId);
		await this.doctorRepo.ifDefined({ userId });
		await this.hospRegisterRepo.ifNotDefined({ userId });
		await this.hospRegisterRepo.create({ hospitalId, userId });
		return true;
	}
}
