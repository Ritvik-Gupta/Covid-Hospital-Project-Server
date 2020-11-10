import { hash } from "argon2";
import { Service } from "typedi";
import { AbstractRepository, EntityRepository, SelectQueryBuilder } from "typeorm";
import { User } from "../entity/User.ent";
import { UserInput } from "../input/User.inp";
import { UserRoles } from "../service/customTypes";
import { normalizedFieldPaths } from "../service/normalizeInfo";

@Service()
@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
	async isDef(
		checkParam: string,
		{ withParam }: { withParam: "id" | "email" } = { withParam: "id" }
	): Promise<User> {
		const user = await this.repository.findOne({ where: { [withParam]: checkParam } });
		if (user === undefined) throw new Error("No such User exists");
		return user;
	}

	async isNotDef(
		checkParam: string,
		{ withParam }: { withParam: "id" | "email" } = { withParam: "id" }
	): Promise<void> {
		const [, check] = await this.repository.findAndCount({ where: { [withParam]: checkParam } });
		if (check !== 0) throw new Error("User Already Registered with the Email");
	}

	async createAndReturn({ password, ...userInp }: UserInput, role: UserRoles): Promise<User> {
		const hashPassword = await hash(password);
		return await this.repository.save(
			this.repository.create({ ...userInp, password: hashPassword, role })
		);
	}

	getPopulatedQuery(fieldPath: normalizedFieldPaths): SelectQueryBuilder<User> {
		const query = this.repository.createQueryBuilder(fieldPath.parent);
		fieldPath.joins.forEach(([parent, child]) => {
			query.leftJoinAndSelect(`${parent}.${child}`, child);
		});
		return query;
	}
}
