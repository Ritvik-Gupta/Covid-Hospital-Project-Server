import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Medicine } from "../entity/Medicine.ent";

@Service()
@EntityRepository(Medicine)
export class MedicineRepository extends Repository<Medicine> {
	async isDef(name: string): Promise<Medicine> {
		const medicine = await this.findOne({ where: { name } });
		if (medicine === undefined) throw new Error("No such Medicine exists");
		return medicine;
	}

	async isNotDef(name: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { name } });
		if (check !== 0) throw new Error("Medicine has already been created");
	}
}
