import { hash } from "argon2";
import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User.ent";
import { UserInput } from "../input/User.inp";
import { UserRoles } from "../service/customTypes";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
	async isDef(
		checkParam: string,
		{ withEmail }: { withEmail: boolean } = { withEmail: false }
	): Promise<User> {
		const user = await this.findOne({
			where: withEmail === true ? { email: checkParam } : { id: checkParam },
		});
		if (user === undefined) throw new Error("No such User exists");
		return user;
	}

	async isNotDef(
		checkParam: string,
		{ withEmail }: { withEmail: boolean } = { withEmail: false }
	): Promise<void> {
		const [, check] = await this.findAndCount({
			where: withEmail === true ? { email: checkParam } : { id: checkParam },
		});
		if (check !== 0) throw new Error("User Already Registered");
	}

	async createAndReturn(
		{ password, ...userInp }: UserInput,
		role: UserRoles
	): Promise<User> {
		const hashPassword = await hash(password);
		return await this.save(
			this.create({ ...userInp, password: hashPassword, role })
		);
	}
}
