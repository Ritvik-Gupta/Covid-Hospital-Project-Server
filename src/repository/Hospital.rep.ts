import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Hospital } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Hospital)
export class HospitalRepository extends customRepository<Hospital>({
	ifDefined: "Hospital has already been created",
	ifNotDefined: "No such Hospital exists",
}) {
	async checkAdmin(hospitalId: string, adminId: string): Promise<void> {
		const hospital = await this.ifDefined({ id: hospitalId });
		if (hospital.adminId !== adminId) throw Error("Hospital does not belong to the Admin");
	}
}
