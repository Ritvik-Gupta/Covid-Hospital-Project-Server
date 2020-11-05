import { Service } from "typedi";
import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm";
import { HospRegister } from "../entity/HospRegister.ent";
import { normalizedFieldPaths } from "../service/normalizeInfo";

@Service()
@EntityRepository(HospRegister)
export class HospRegisterRepository extends Repository<HospRegister> {
	async isDef(userId: string): Promise<HospRegister> {
		const record = await this.findOne({ where: { userId } });
		if (record === undefined)
			throw new Error("User is not Registered to any Hospital");
		return record;
	}

	async isNotDef(userId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { userId } });
		if (check !== 0) throw new Error("User Already Registered To a Hospital");
	}

	async areInSameHosp(userId_A: string, userId_B: string): Promise<string> {
		const record_A = await this.isDef(userId_A);
		const record_B = await this.isDef(userId_B);
		if (record_A.hospitalId !== record_B.hospitalId)
			throw new Error("Users don't belong to the same Hospital");
		return record_A.hospitalId;
	}
	
	async getPopulatedQuery(
		fieldPath: normalizedFieldPaths
	): Promise<SelectQueryBuilder<HospRegister>> {
		const query = this.createQueryBuilder(fieldPath.parent);
		fieldPath.joins.forEach(([parent, child]) => {
			query.leftJoinAndSelect(`${parent}.${child}`, child);
		});
		return query;
	}
}
