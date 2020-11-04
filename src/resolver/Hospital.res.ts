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
	hospitals(@FieldObject() fieldObject: normalizeFieldObject): Promise<Hospital[]> {
		return this.hospitalRepo.fetchAll(fieldObject);
	}

	@Query(() => Hospital, { nullable: true })
	hospital(
		@FieldObject() fieldObject: normalizeFieldObject,
		@Arg("hospitalId", () => String) hospitalId: string
	): Promise<Hospital | undefined> {
		return this.hospitalRepo.fetchOne(hospitalId, fieldObject);
	}

	// @Query(() => Hospital, { nullable: true })
	// hospitalCovidPatients(
	// 	@FieldObject() fieldObject: normalizeFieldObject,
	// 	@Arg("hospitalId", () => String) hospitalId: string
	// ): Promise<Hospital | undefined> {
	// 	return this.hospitalRepo.fetchOne(hospitalId, fieldObject);
	// }
}
