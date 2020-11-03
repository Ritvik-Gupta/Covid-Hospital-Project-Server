import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { PrescribedMed } from "../entity/PrescribedMed.ent";

@Service()
@EntityRepository(PrescribedMed)
export class PrescribedMedRepository extends Repository<PrescribedMed> {
	async isDef(patientId: string, medName: string): Promise<PrescribedMed> {
		const prescription = await this.findOne({ where: { patientId, medName } });
		if (prescription === undefined) throw new Error("No such Prescription exists");
		return prescription;
	}

	async isNotDef(patientId: string, medName: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { patientId, medName } });
		if (check !== 0) throw new Error("Prescription already exists");
	}
}
