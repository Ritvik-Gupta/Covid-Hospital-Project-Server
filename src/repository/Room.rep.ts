import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Room } from "../entity/Room.ent";

@Service()
@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
	async isDef(roomNo: number, hospitalId: string): Promise<Room> {
		const room = await this.findOne({ where: { roomNo, hospitalId } });
		if (room === undefined) throw new Error("No such Room exists");
		return room;
	}

	async isNotDef(roomNo: number, hospitalId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { hospitalId, roomNo } });
		if (check !== 0) throw new Error("Room already created");
	}
}
