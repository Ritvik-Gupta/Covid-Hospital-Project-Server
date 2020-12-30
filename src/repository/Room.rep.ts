import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Room } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Room)
export class RoomRepository extends customRepository<Room>({
	ifDefined: "Room already created",
	ifNotDefined: "No such Room exists",
}) {}
