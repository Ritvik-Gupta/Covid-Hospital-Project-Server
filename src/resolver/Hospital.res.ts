import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Hospital } from "../entity/Hospital.ent";
import { HospitalInput } from "../input/Hospital.inp";
import { DoctorRepository } from "../repository/Doctor.rep";
import { HospitalRepository } from "../repository/Hospital.rep";
import { HospRegisterRepository } from "../repository/HospRegister.rep";
import { StaffRepository } from "../repository/Staff.rep";
import { perfectCtx, UserRoles } from "../service/customTypes";

@Service()
@Resolver()
export class HospitalResolver {
	constructor(
		@InjectRepository() private readonly staffRepo: StaffRepository,
		@InjectRepository() private readonly doctorRepo: DoctorRepository,
		@InjectRepository() private readonly hospitalRepo: HospitalRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository
	) {}

	@Query(() => [Hospital])
	async hospitals(): Promise<Hospital[]> {
		return await this.hospitalRepo.find();
	}

	@Query(() => Hospital)
	async hospital(
		@Arg("hospitalId", () => String) hospitalId: string
	): Promise<Hospital> {
		const hospital = await this.hospitalRepo
			.createQueryBuilder("hospital")
			.leftJoinAndSelect("hospital.rooms", "rooms")
			.where("hospital.id = :hospitalId", { hospitalId })
			.getOne();
		if (hospital === undefined) throw new Error("No such Hospital exists");
		return hospital;
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
