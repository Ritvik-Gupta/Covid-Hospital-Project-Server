import { Arg, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getRepository } from "typeorm";
import { Bed } from "../entity/Bed.ent";
import { keys } from "../service/customTypes";
import { hospitalDef, roomDef } from "./middleware/isDefined.mid";
import { bedNotDef } from "./middleware/isNotDefined.mid";

@Resolver()
export class BedResolver {
	@Mutation(() => Boolean)
	@UseMiddleware(hospitalDef, roomDef, bedNotDef)
	async addBed(
		@Arg(keys.hospitalId, () => String) hospitalId: string,
		@Arg(keys.roomNo, () => Int) roomNo: number,
		@Arg(keys.bedNo, () => Int) bedNo: number
	): Promise<boolean> {
		await getRepository(Bed).save(
			getRepository(Bed).create({ bedNo, roomNo, hospitalId })
		);
		return true;
	}
}
