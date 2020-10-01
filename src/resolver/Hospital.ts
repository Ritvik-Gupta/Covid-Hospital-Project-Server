import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

import { Hospital } from "../entity/Hospital";
import { HospitalRepository } from "../repository/Hospital";
import { HospitalInput } from "./input-type/HospitalInput";

@Service()
@Resolver()
export class HospitalResolver {
	constructor(
		@InjectRepository()
		private readonly hospitalRepo: HospitalRepository
	) {}

	@Query(() => [Hospital])
	async hospitals(): Promise<Array<Hospital>> {
		return await this.hospitalRepo.find();
	}

	@Mutation(() => Hospital)
	async addHospital(
		@Arg("hospitalInput", () => HospitalInput) hospInp: HospitalInput
	): Promise<Hospital> {
		const res = this.hospitalRepo.create(hospInp);
		return await this.hospitalRepo.save(res);
	}
}
