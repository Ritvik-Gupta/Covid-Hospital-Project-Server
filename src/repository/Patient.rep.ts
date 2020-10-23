import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Patient } from "../entity/Patient.ent";

@Service()
@EntityRepository(Patient)
export class PatientRepository extends Repository<Patient> {
	async isDef(userId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { userId } });
		if (check === 0) throw new Error("No such Patient exists");
	}
}
