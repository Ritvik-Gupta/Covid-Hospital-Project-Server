import { Int, Mutation, Resolver } from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { Room } from "../entity/Room.ent";
import { hospitalDef } from "../middleware/isDefined.mid";
import { roomNotDef } from "../middleware/isNotDefined.mid";
import { ArgKey, ValidateArgs } from "../service/customTypes";

@Resolver()
export class RoomResolver {
	@Mutation(() => Boolean)
	@ValidateArgs([hospitalDef, roomNotDef])
	async addRoom(
		@ArgKey("hospitalId", () => String) hospitalId: string,
		@ArgKey("roomNo", () => Int) roomNo: number
	): Promise<boolean> {
		await createQueryBuilder()
			.insert()
			.into(Room)
			.values({ hospitalId, roomNo })
			.execute();
		return true;
	}
}
