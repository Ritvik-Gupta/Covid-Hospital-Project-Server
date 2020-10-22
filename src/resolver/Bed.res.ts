import { Int, Mutation, Resolver } from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { Bed } from "../entity/Bed.ent";
import { ArgKey, ValidateArgs } from "../service/customTypes";
import { hospitalDef, roomDef } from "../middleware/isDefined.mid";
import { bedNotDef } from "../middleware/isNotDefined.mid";

@Resolver()
export class BedResolver {
	@Mutation(() => Boolean)
	@ValidateArgs([hospitalDef, roomDef, bedNotDef])
	async addBed(
		@ArgKey("hospitalId", () => String) hospitalId: string,
		@ArgKey("roomNo", () => Int) roomNo: number,
		@ArgKey("bedNo", () => Int) bedNo: number
	): Promise<boolean> {
		await createQueryBuilder()
			.insert()
			.into(Bed)
			.values({ bedNo, roomNo, hospitalId })
			.execute();
		return true;
	}
}
