import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getRepository } from "typeorm";
import { Hospital } from "../entity/Hospital.entity";
import { HospitalInput } from "./input/Hospital.input";

@Resolver()
export class HospitalResolver {
	@Query(() => [Hospital])
	async hospitals(): Promise<Hospital[]> {
		return await getRepository(Hospital).find();
	}

	@Query(() => Hospital)
	async hospital(
		@Arg("hospitalId", () => String) hospitalId: string
	): Promise<Hospital> {
		const hospital = await createQueryBuilder(Hospital, "hospital")
			.innerJoinAndSelect("hospital.rooms", "rooms")
			.where("hospital.id = :id", { id: hospitalId })
			.getOne();
		if (hospital === undefined) throw new Error("No such Hospital");

		return hospital;
	}

	@Mutation(() => Boolean)
	async addHospital(
		@Arg("hospital", () => HospitalInput) hospInp: HospitalInput
	): Promise<boolean> {
		await getRepository(Hospital).insert(hospInp);
		return true;
	}
}
