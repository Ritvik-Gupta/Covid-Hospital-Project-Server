import { Service } from "typedi";
import { EntityRepository, AbstractRepository } from "typeorm";
import { PrescribedMed } from "../entity/PrescribedMed.ent";

@Service()
@EntityRepository(PrescribedMed)
export class PrescribedMedRepository extends AbstractRepository<PrescribedMed> {
	async isDef(patientId: string, medName: string): Promise<PrescribedMed> {
		const prescription = await this.repository.findOne({ where: { patientId, medName } });
		if (prescription === undefined) throw new Error("No such Prescription exists");
		return prescription;
	}

	async isNotDef(patientId: string, medName: string): Promise<void> {
		const [, check] = await this.repository.findAndCount({ where: { patientId, medName } });
		if (check !== 0) throw new Error("Prescription already exists");
	}

	async create(patientId: string, medicineName: string): Promise<void> {
		await this.repository.insert({ patientId, medicineName });
	}
}
