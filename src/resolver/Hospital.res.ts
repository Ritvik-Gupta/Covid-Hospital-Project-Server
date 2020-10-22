import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { createQueryBuilder, getRepository } from "typeorm";
import { Hospital } from "../entity/Hospital.ent";
import { HospitalRegister } from "../entity/HospitalRegister.ent";
import { keys } from "../service/customTypes";
import { HospitalInput } from "./input/Hospital.inp";
import { hospitalDef, userDef } from "./middleware/isDefined.mid";
import { registerNotDef } from "./middleware/isNotDefined.mid";

@Resolver()
export class HospitalResolver {
	@Query(() => [Hospital])
	async hospitals(): Promise<Hospital[]> {
		return await getRepository(Hospital).find();
	}

	@Query(() => Hospital)
	async hospital(
		@Arg(keys.hospitalId, () => String) hospitalId: string
	): Promise<Hospital> {
		const hospital = await createQueryBuilder(Hospital, "hospital")
			.leftJoinAndSelect("hospital.rooms", "rooms")
			.where("hospital.id = :hospitalId", { hospitalId })
			.getOne();
		if (hospital === undefined) throw new Error("No such Hospital");

		return hospital;
	}

	@Mutation(() => Boolean)
	async addHospital(
		@Arg(keys.hospital, () => HospitalInput) hospInp: HospitalInput
	): Promise<boolean> {
		await getRepository(Hospital).insert(hospInp);
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(hospitalDef, userDef, registerNotDef)
	async registerToHospital(
		@Arg(keys.hospitalId, () => String) hospitalId: string,
		@Arg(keys.userId, () => String) userId: string
	): Promise<boolean> {
		await getRepository(HospitalRegister).save(
			getRepository(HospitalRegister).create({ hospitalId, userId })
		);
		return true;
	}
}
