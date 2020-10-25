import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Patient } from "../entity/Patient.ent";

@Service()
@EntityRepository(Patient)
export class PatientRepository extends Repository<Patient> {
	async isDef(userId: string): Promise<Patient> {
		const patient = await this.findOne({ where: { userId } });
		if (patient === undefined) throw new Error("No such Patient exists");
		return patient;
	}
}
