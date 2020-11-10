import { Service } from "typedi";
import { EntityRepository, AbstractRepository } from "typeorm";
import { Bed } from "../entity/Bed.ent";

@Service()
@EntityRepository(Bed)
export class BedRepository extends AbstractRepository<Bed> {
	async isDef(bedNo: number, roomNo: number, hospitalId: string): Promise<Bed> {
		const bed = await this.repository.findOne({ where: { bedNo, roomNo, hospitalId } });
		if (bed === undefined) throw new Error("No such Bed exists");
		return bed;
	}

	async isNotDef(bedNo: number, roomNo: number, hospitalId: string): Promise<void> {
		const [, check] = await this.repository.findAndCount({
			where: { bedNo, roomNo, hospitalId },
		});
		if (check !== 0) throw new Error("Bed already created");
	}

	async create(bedNo: number, roomNo: number, hospitalId: string): Promise<void> {
		await this.repository.insert({ bedNo, roomNo, hospitalId });
	}
}
