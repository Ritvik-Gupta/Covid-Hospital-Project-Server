import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Hospital } from "../entity/Hospital.ent";

@Service()
@EntityRepository(Hospital)
export class HospitalRepository extends Repository<Hospital> {
	async isDef(hospitalId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { id: hospitalId } });
		if (check === 0) throw new Error("No such Hospital exists");
	}

	async isNotDef(name: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { name } });
		if (check !== 0) throw new Error("Hospital Name must be unique");
	}
}
