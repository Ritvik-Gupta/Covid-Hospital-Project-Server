import { DeepPartial, EntityRepository, Repository } from "typeorm";
import { Service } from "typedi";

import { Hospital } from "../entity/Hospital";

@Service()
@EntityRepository(Hospital)
export class HospitalRepository extends Repository<Hospital> {
	async findOrCreate(hosp: DeepPartial<Hospital>): Promise<boolean> {
		const res = this.findOne(hosp.id);
		if (res !== undefined) return true;
		await this.save(hosp);
		return false;
	}
}
