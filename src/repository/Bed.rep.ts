import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Bed } from "../entity/Bed.ent";

@Service()
@EntityRepository(Bed)
export class BedRepository extends Repository<Bed> {
	async isDef(bedNo: number, roomNo: number, hospitalId: string): Promise<Bed> {
		const bed = await this.findOne({ where: { bedNo, roomNo, hospitalId } });
		if (bed === undefined) throw new Error("No such Bed exists");
		return bed;
	}

	async isNotDef(bedNo: number, roomNo: number, hospitalId: string): Promise<void> {
		const [, check] = await this.findAndCount({
			where: { bedNo, roomNo, hospitalId },
		});
		if (check !== 0) throw new Error("Bed already created");
	}
}
