import { Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getRepository } from "typeorm";
import { Hospital } from "../entity/Hospital.ent";
import { HospitalRegister } from "../entity/HospitalRegister.ent";
import { hospitalDef, userDef } from "../middleware/isDefined.mid";
import { hospitalNotDef, registerNotDef } from "../middleware/isNotDefined.mid";
import { ArgKey, ValidateArgs } from "../service/customTypes";
import { HospitalInput } from "../input/Hospital.inp";

@Resolver()
export class HospitalResolver {
	@Query(() => [Hospital])
	async hospitals(): Promise<Hospital[]> {
		return await getRepository(Hospital).find();
	}

	@Query(() => Hospital)
	async hospital(
		@ArgKey("hospitalId", () => String) hospitalId: string
	): Promise<Hospital> {
		const hospital = await createQueryBuilder(Hospital, "hospital")
			.leftJoinAndSelect("hospital.rooms", "rooms")
			.where("hospital.id = :hospitalId", { hospitalId })
			.getOne();
		if (hospital === undefined) throw new Error("No such Hospital");

		return hospital;
	}

	@Mutation(() => Boolean)
	@ValidateArgs([hospitalNotDef])
	async addHospital(
		@ArgKey("hospital", () => HospitalInput) hospInp: HospitalInput
	): Promise<boolean> {
		await createQueryBuilder().insert().into(Hospital).values(hospInp).execute();
		return true;
	}

	@Mutation(() => Boolean)
	@ValidateArgs([hospitalDef, userDef, registerNotDef])
	async registerToHospital(
		@ArgKey("hospitalId", () => String) hospitalId: string,
		@ArgKey("userId", () => String) userId: string
	): Promise<boolean> {
		await createQueryBuilder()
			.insert()
			.into(HospitalRegister)
			.values({ hospitalId, userId })
			.execute();
		return true;
	}
}
