import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Hospital } from "../entity/Hospital.ent";

@Service()
@EntityRepository(Hospital)
export class HospitalRepository extends Repository<Hospital> {
	async isDef(hospitalId: string): Promise<Hospital> {
		const hospital = await this.findOne({ where: { id: hospitalId } });
		if (hospital === undefined) throw new Error("No such Hospital exists");
		return hospital;
	}

	async isNotDef(name: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { name } });
		if (check !== 0) throw new Error("Hospital Name must be unique");
	}
}
