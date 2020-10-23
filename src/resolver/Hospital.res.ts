import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Hospital } from "../entity/Hospital.ent";
import { HospitalInput } from "../input/Hospital.inp";
import { HospitalRepository } from "../repository/Hospital.rep";
import { HospitalRegisterRepository } from "../repository/HospitalRegister.rep";
import { UserRepository } from "../repository/User.rep";

@Service()
@Resolver()
export class HospitalResolver {
	constructor(
		@InjectRepository() private readonly hospitalRepo: HospitalRepository,
		@InjectRepository() private readonly userRepo: UserRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospitalRegisterRepository
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
	async addHospital(
		@Arg("hospital", () => HospitalInput) hospInp: HospitalInput
	): Promise<boolean> {
		await this.hospitalRepo.isNotDef(hospInp.name);
		await this.hospitalRepo.insert(hospInp);
		return true;
	}

	@Mutation(() => Boolean)
	async registerToHospital(
		@Arg("hospitalId", () => String) hospitalId: string,
		@Arg("userId", () => String) userId: string
	): Promise<boolean> {
		await this.hospitalRepo.isNotDef(hospitalId);
		await this.userRepo.isDef(userId);
		await this.hospRegisterRepo.isNotDef(userId);
		await this.hospRegisterRepo.insert({ hospitalId, userId });
		return true;
	}
}
