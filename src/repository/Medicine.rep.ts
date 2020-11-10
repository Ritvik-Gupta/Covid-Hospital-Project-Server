import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { Medicine } from "../entity/Medicine.ent";
import { MedicineInput } from "../input/Medicine.inp";

@Service()
@EntityRepository(Medicine)
export class MedicineRepository extends AbstractRepository<Medicine> {
	async isDef(name: string): Promise<Medicine> {
		const medicine = await this.repository.findOne({ where: { name } });
		if (medicine === undefined) throw new Error("No such Medicine exists");
		return medicine;
	}

	async isNotDef(name: string): Promise<void> {
		const [, check] = await this.repository.findAndCount({ where: { name } });
		if (check !== 0) throw new Error("Medicine has already been created");
	}

	async create(medInp: MedicineInput): Promise<void> {
		await this.repository.insert(medInp);
	}
}
