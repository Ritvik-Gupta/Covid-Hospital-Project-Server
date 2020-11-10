import { Service } from "typedi";
import { EntityRepository, AbstractRepository } from "typeorm";
import { Room } from "../entity/Room.ent";

@Service()
@EntityRepository(Room)
export class RoomRepository extends AbstractRepository<Room> {
	async isDef(roomNo: number, hospitalId: string): Promise<Room> {
		const room = await this.repository.findOne({ where: { roomNo, hospitalId } });
		if (room === undefined) throw new Error("No such Room exists");
		return room;
	}

	async isNotDef(roomNo: number, hospitalId: string): Promise<void> {
		const [, check] = await this.repository.findAndCount({ where: { hospitalId, roomNo } });
		if (check !== 0) throw new Error("Room already created");
	}

	async create(roomNo: number, hospitalId: string): Promise<void> {
		await this.repository.insert({ roomNo, hospitalId });
	}
}
