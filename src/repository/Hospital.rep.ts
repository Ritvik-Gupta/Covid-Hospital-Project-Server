import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Hospital } from "../entity/Hospital.ent";
import { getFieldPaths, normalizeFieldObject } from "../service/normalizeInfo";

@Service()
@EntityRepository(Hospital)
export class HospitalRepository extends Repository<Hospital> {
	async isDef(
		checkParam: string,
		{ withName }: { withName: boolean } = { withName: false }
	): Promise<Hospital> {
		const hospital = await this.findOne({
			where: withName === true ? { name: checkParam } : { id: checkParam },
		});
		if (hospital === undefined) throw new Error("No such Hospital exists");
		return hospital;
	}

	async isNotDef(
		checkParam: string,
		{ withName }: { withName: boolean } = { withName: false }
	): Promise<void> {
		const [, check] = await this.findAndCount({
			where: withName === true ? { name: checkParam } : { id: checkParam },
		});
		if (check !== 0) throw new Error("Hospital has already been created");
	}

	async checkAdmin(hospitalId: string, adminId: string): Promise<void> {
		const hospital = await this.isDef(hospitalId);
		if (hospital.adminId !== adminId)
			throw new Error("Hospital does not belong to the Admin");
	}

	async fetchAll(fieldObject: normalizeFieldObject): Promise<Hospital[]> {
		const fieldPaths = getFieldPaths(fieldObject);
		const query = this.createQueryBuilder(fieldPaths.parent);
		fieldPaths.joins.forEach(([parent, child]) => {
			query.leftJoinAndSelect(`${parent}.${child}`, child);
		});
		return query.getMany();
	}
}
