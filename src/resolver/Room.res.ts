import { Arg, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getRepository } from "typeorm";
import { Room } from "../entity/Room.ent";
import { keys } from "../service/customTypes";
import { hospitalDef } from "./middleware/isDefined.mid";
import { roomNotDef } from "./middleware/isNotDefined.mid";

@Resolver()
export class RoomResolver {
	@Mutation(() => Boolean)
	@UseMiddleware(hospitalDef, roomNotDef)
	async addRoom(
		@Arg(keys.hospitalId, () => String) hospitalId: string,
		@Arg(keys.roomNo, () => Int) roomNo: number
	): Promise<boolean> {
		await getRepository(Room).save(
			getRepository(Room).create({ hospitalId, roomNo })
		);
		return true;
	}
}
