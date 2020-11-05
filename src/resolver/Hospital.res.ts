import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CovidRegister } from "../entity/CovidRegister.ent";
import { Hospital } from "../entity/Hospital.ent";
import { HospRegister } from "../entity/HospRegister.ent";
import { CovidRegisterRepository } from "../repository/CovidRegister.rep";
import { HospitalRepository } from "../repository/Hospital.rep";
import { HospRegisterRepository } from "../repository/HospRegister.rep";
import { perfectCtx } from "../service/customTypes";
import { FieldPath, normalizedFieldPaths } from "../service/normalizeInfo";

@Service()
@Resolver()
export class HospitalResolver {
	constructor(
		@InjectRepository() private readonly hospitalRepo: HospitalRepository,
		@InjectRepository() private readonly hospRegisterRepo: HospRegisterRepository,
		@InjectRepository() private readonly covidRegisterRepo: CovidRegisterRepository
	) {}

	@Query(() => [Hospital])
	async hospitals(
		@FieldPath() fieldPath: normalizedFieldPaths
	): Promise<Hospital[]> {
		const query = await this.hospitalRepo.getPopulatedQuery(fieldPath);
		return await query.getMany();
	}

	@Query(() => Hospital, { nullable: true })
	async hospital(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Arg("hospitalId", () => String) hospitalId: string
	): Promise<Hospital | undefined> {
		const query = await this.hospitalRepo.getPopulatedQuery(fieldPath);
		query.where(`${fieldPath.parent}.id = :hospitalId`, { hospitalId });
		return await query.getOne();
	}

	@Query(() => HospRegister, { nullable: true })
	@Authorized()
	async registeredAtHospital(
		@Ctx() { req }: perfectCtx,
		@FieldPath() fieldPath: normalizedFieldPaths
	): Promise<HospRegister | undefined> {
		const query = await this.hospRegisterRepo.getPopulatedQuery(fieldPath);
		return await query
			.where(`${fieldPath.parent}.userId = :userId`, { userId: req.session.userId })
			.getOne();
	}

	@Query(() => [CovidRegister], { nullable: true })
	async covidPatientsInHospital(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Arg("hospitalId", () => String) hospitalId: string
	): Promise<CovidRegister[]> {
		const query = await this.covidRegisterRepo.getPopulatedQuery(fieldPath);
		return await query
			.where(`${fieldPath.parent}.hospitalId = :hospitalId`, { hospitalId })
			.getMany();
	}

	// @Query(() => Hospital, { nullable: true })
	// hospitalCovidPatients(
	// 	@FieldObject() fieldObject: normalizeFieldObject,
	// 	@Arg("hospitalId", () => String) hospitalId: string
	// ): Promise<Hospital | undefined> {
	// 	return this.hospitalRepo.fetchOne(hospitalId, fieldObject);
	// }
}
