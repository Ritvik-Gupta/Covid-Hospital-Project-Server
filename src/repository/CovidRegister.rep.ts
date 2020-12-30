import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { CovidRegister } from "../entity";
import { CovidEntry, customRepository } from "../service";

@Service()
@EntityRepository(CovidRegister)
export class CovidRegisterRepository extends customRepository<CovidRegister>({
	ifDefined: "Covid Record for the Patient already exists",
	ifNotDefined: "No Covid Record found for the Patient",
}) {
	async checkLastRecord(patientId: string, entry: CovidEntry): Promise<void> {
		const record = await this.repository
			.createQueryBuilder("record")
			.where("record.patientId = :patientId", { patientId })
			.orderBy("record.entryDate", "DESC")
			.limit(1)
			.getOne();

		if (record === undefined) throw Error("No Record Found for the Patient");
		if (record.entry !== entry) throw Error("Invalid Entry provided for the Latest Record");
	}

	async addAffectedRecord(patientId: string, hospitalId: string): Promise<void> {
		await this.ifNotDefined({ patientId });
		await this.repository.insert({ patientId, hospitalId, entry: CovidEntry.AFFECTED });
	}
}
