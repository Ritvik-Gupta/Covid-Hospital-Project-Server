import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CovidRegister, Hospital, HospRegister } from "../entity";
import { CovidRegisterRepository, HospitalRepository, HospRegisterRepository } from "../repository";
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
	hospitals(@FieldPath() fieldPath: normalizedFieldPaths): Promise<Hospital[]> {
		return this.hospitalRepo.getPopulatedQuery(fieldPath).getMany();
	}

	@Query(() => Hospital, { nullable: true })
	hospital(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Arg("hospitalId", () => String) hospitalId: string
	): Promise<Hospital | undefined> {
		return this.hospitalRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.id = :hospitalId`, { hospitalId })
			.getOne();
	}

	@Query(() => HospRegister, { nullable: true })
	@Authorized()
	registeredAtHospital(
		@Ctx() { req }: perfectCtx,
		@FieldPath() fieldPath: normalizedFieldPaths
	): Promise<HospRegister | undefined> {
		return this.hospRegisterRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.userId = :userId`, { userId: req.session.userId })
			.getOne();
	}

	@Query(() => [CovidRegister], { nullable: true })
	covidPatientsInHospital(
		@FieldPath() fieldPath: normalizedFieldPaths,
		@Arg("hospitalId", () => String) hospitalId: string
	): Promise<CovidRegister[]> {
		return this.covidRegisterRepo
			.getPopulatedQuery(fieldPath)
			.where(`${fieldPath.parent}.hospitalId = :hospitalId`, { hospitalId })
			.getMany();
	}
}
