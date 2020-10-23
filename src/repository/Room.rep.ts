import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Room } from "../entity/Room.ent";

@Service()
@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
	async isDef(roomNo: number, hospitalId: string) {
		const [, check] = await this.findAndCount({ where: { roomNo, hospitalId } });
		if (check === 0) throw new Error("No such Room exists");
	}

	async isNotDef(roomNo: number, hospitalId: string) {
		const [, check] = await this.findAndCount({ where: { hospitalId, roomNo } });
		if (check !== 0) throw new Error("Room already created");
	}
}
