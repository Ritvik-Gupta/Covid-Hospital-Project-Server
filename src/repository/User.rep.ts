import { hash } from "argon2";
import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User.ent";
import { UserInput } from "../input/User.inp";
import { userRoles } from "../service/customTypes";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
	async isDef(userId: string): Promise<User> {
		const user = await this.findOne({ where: { id: userId } });
		if (user === undefined) throw new Error("No such User exists");
		return user;
	}

	async isDefWithEmail(email: string): Promise<User> {
		const user = await this.findOne({ where: { email } });
		if (user === undefined) throw new Error("No such User exists");
		return user;
	}

	async isNotDef(email: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { email } });
		if (check !== 0) throw new Error("User Already Registered");
	}

	async createAndReturn(
		{ password, ...userInp }: UserInput,
		role: userRoles
	): Promise<User> {
		const hashPassword = await hash(password);
		return await this.save(this.create({ ...userInp, hashPassword, role }));
	}
}
