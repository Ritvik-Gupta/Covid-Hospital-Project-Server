import { Arg, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Hospital } from "../entity/Hospital.ent";
import { HospitalRepository } from "../repository/Hospital.rep";
import { FieldObject, normalizeFieldObject } from "../service/normalizeInfo";

@Service()
@Resolver()
export class HospitalResolver {
	constructor(
		@InjectRepository() private readonly hospitalRepo: HospitalRepository
	) {}

	@Query(() => [Hospital])
	async hospitals(
		@FieldObject() fieldObject: normalizeFieldObject
	): Promise<Hospital[]> {
		return await this.hospitalRepo.fetchAll(fieldObject);
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
}
