import { Service } from "typedi";
import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm";
import { CovidRegister } from "../entity/CovidRegister.ent";
import { CovidEntry } from "../service/customTypes";
import { normalizedFieldPaths } from "../service/normalizeInfo";

@Service()
@EntityRepository(CovidRegister)
export class CovidRegisterRepository extends Repository<CovidRegister> {
	async isNotDef(patientId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { patientId } });
		if (check !== 0) throw new Error("Covid Record for Patient already exists");
	}

	async checkLastRecord(patientId: string, entry: CovidEntry): Promise<void> {
		const record = await this.createQueryBuilder("record")
			.where("record.patientId = :patientId", { patientId })
			.orderBy("record.entryDate", "DESC")
			.limit(1)
			.getOne();

		if (record === undefined) throw new Error("No Record Found for the Patient");
		if (record.entry !== entry)
			throw new Error("Invalid Entry provided for the Latest Record");
	}

	async addAffectedRecord(patientId: string, hospitalId: string): Promise<void> {
		await this.isNotDef(patientId);
		await this.insert({ patientId, hospitalId, entry: CovidEntry.AFFECTED });
	}

	async getPopulatedQuery(
		fieldPath: normalizedFieldPaths
	): Promise<SelectQueryBuilder<CovidRegister>> {
		const query = this.createQueryBuilder(fieldPath.parent);
		fieldPath.joins.forEach(([parent, child]) => {
			query.leftJoinAndSelect(`${parent}.${child}`, child);
		});
		return query;
	}
}
