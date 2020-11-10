import { Service } from "typedi";
import { AbstractRepository, EntityRepository, SelectQueryBuilder } from "typeorm";
import { Hospital } from "../entity/Hospital.ent";
import { HospitalInput } from "../input/Hospital.inp";
import { normalizedFieldPaths } from "../service/normalizeInfo";

@Service()
@EntityRepository(Hospital)
export class HospitalRepository extends AbstractRepository<Hospital> {
	async isDef(
		checkParam: string,
		{ withParam }: { withParam: "id" | "name" } = { withParam: "id" }
	): Promise<Hospital> {
		const hospital = await this.repository.findOne({
			where: { [withParam]: checkParam },
		});
		if (hospital === undefined) throw new Error("No such Hospital exists");
		return hospital;
	}

	async isNotDef(
		checkParam: string,
		{ withParam }: { withParam: "id" | "name" } = { withParam: "id" }
	): Promise<void> {
		const [, check] = await this.repository.findAndCount({
			where: { [withParam]: checkParam },
		});
		if (check !== 0) throw new Error("Hospital has already been created");
	}

	async checkAdmin(hospitalId: string, adminId: string): Promise<void> {
		const hospital = await this.isDef(hospitalId);
		if (hospital.adminId !== adminId) throw new Error("Hospital does not belong to the Admin");
	}

	async create(hospInp: HospitalInput, adminId: string): Promise<void> {
		await this.repository.insert({ ...hospInp, adminId });
	}

	getPopulatedQuery(fieldPath: normalizedFieldPaths): SelectQueryBuilder<Hospital> {
		const query = this.repository.createQueryBuilder(fieldPath.parent);
		fieldPath.joins.forEach(([parent, child]) => {
			query.leftJoinAndSelect(`${parent}.${child}`, child);
		});
		return query;
	}
}
