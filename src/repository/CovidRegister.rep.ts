import { Service } from "typedi";
import { EntityRepository, AbstractRepository, SelectQueryBuilder } from "typeorm";
import { CovidRegister } from "../entity/CovidRegister.ent";
import { CovidEntry } from "../service/customTypes";
import { normalizedFieldPaths } from "../service/normalizeInfo";

@Service()
@EntityRepository(CovidRegister)
export class CovidRegisterRepository extends AbstractRepository<CovidRegister> {
	async isNotDef(patientId: string): Promise<void> {
		const [, check] = await this.repository.findAndCount({ where: { patientId } });
		if (check !== 0) throw new Error("Covid Record for Patient already exists");
	}

	async checkLastRecord(patientId: string, entry: CovidEntry): Promise<void> {
		const record = await this.repository
			.createQueryBuilder("record")
			.where("record.patientId = :patientId", { patientId })
			.orderBy("record.entryDate", "DESC")
			.limit(1)
			.getOne();

		if (record === undefined) throw new Error("No Record Found for the Patient");
		if (record.entry !== entry) throw new Error("Invalid Entry provided for the Latest Record");
	}

	async addAffectedRecord(patientId: string, hospitalId: string): Promise<void> {
		await this.isNotDef(patientId);
		await this.repository.insert({ patientId, hospitalId, entry: CovidEntry.AFFECTED });
	}

	async create(patientId: string, hospitalId: string, entry: CovidEntry): Promise<void> {
		await this.repository.insert({ patientId, hospitalId, entry });
	}

	getPopulatedQuery(fieldPath: normalizedFieldPaths): SelectQueryBuilder<CovidRegister> {
		const query = this.repository.createQueryBuilder(fieldPath.parent);
		fieldPath.joins.forEach(([parent, child]) => {
			query.leftJoinAndSelect(`${parent}.${child}`, child);
		});
		return query;
	}
}
