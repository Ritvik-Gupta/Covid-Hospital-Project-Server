import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Hospital } from "../entity/Hospital.ent";
import { HospitalInput } from "../input/Hospital.inp";
import { MedicineInput } from "../input/Medicine.inp";
import { DoctorRepository } from "../repository/Doctor.rep";
import { HospitalRepository } from "../repository/Hospital.rep";
import { HospRegisterRepository } from "../repository/HospRegister.rep";
import { MedicineRepository } from "../repository/Medicine.rep";
import { StaffRepository } from "../repository/Staff.rep";
import { perfectCtx, UserRoles } from "../service/customTypes";
import {
	FieldObject,
	getFieldPaths,
	normalizeFieldObject,
} from "../service/normalizeInfo";

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
	async ownsHospitals(
		@Ctx() { req }: perfectCtx,
		@FieldObject() fieldObject: normalizeFieldObject
	): Promise<Hospital[]> {
		const fieldPath = getFieldPaths(fieldObject);
		const query = await this.hospitalRepo.getPopulatedQuery(fieldPath);
		return await query
			.where(`${fieldPath.parent}.adminId = :adminId`, {
				adminId: req.session.userId,
			})
			.getMany();
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.ADMIN)
	async addHospital(
		@Ctx() { req }: perfectCtx,
		@Arg("hospital", () => HospitalInput) hospInp: HospitalInput
	): Promise<boolean> {
		await this.hospitalRepo.isNotDef(hospInp.name, { withName: true });
		await this.hospitalRepo.insert({ ...hospInp, adminId: req.session.userId });
		return true;
	}

	@Mutation(() => Boolean)
	@Authorized(UserRoles.ADMIN)
	async addMedicine(
		@Arg("medicine", () => MedicineInput) medInp: MedicineInput
	): Promise<boolean> {
		await this.medicineRepo.isNotDef(medInp.name);
		await this.medicineRepo.insert(medInp);
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
		await this.staffRepo.isDef(userId);
		await this.hospRegisterRepo.isNotDef(userId);
		await this.hospRegisterRepo.insert({ hospitalId, userId });
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
		await this.doctorRepo.isDef(userId);
		await this.hospRegisterRepo.isNotDef(userId);
		await this.hospRegisterRepo.insert({ hospitalId, userId });
		return true;
	}
}
