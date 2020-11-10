import { Service } from "typedi";
import { EntityRepository, AbstractRepository } from "typeorm";
import { Patient } from "../entity/Patient.ent";
import { PatientInput } from "../input/Patient.inp";

@Service()
@EntityRepository(Patient)
export class PatientRepository extends AbstractRepository<Patient> {
	async isDef(userId: string): Promise<Patient> {
		const patient = await this.repository.findOne({ where: { userId } });
		if (patient === undefined) throw new Error("No such Patient exists");
		return patient;
	}

	async create(inp: PatientInput, userId: string): Promise<void> {
		await this.repository.insert({ ...inp, userId });
	}
}
