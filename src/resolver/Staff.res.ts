import { hash } from "argon2";
import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getRepository } from "typeorm";
import { Staff } from "../entity/Staff.ent";
import { User, userRoles } from "../entity/User.ent";
import { keys } from "../service/customTypes";
import { StaffInput } from "./input/Staff.inp";
import { UserInput } from "./input/User.inp";
import { userNotDef } from "./middleware/isNotDefined.mid";

@Resolver()
export class StaffResolver {
	@Mutation(() => Boolean)
	@UseMiddleware(userNotDef)
	async registerStaff(
		@Arg(keys.user, () => UserInput) { password, ...userInp }: UserInput,
		@Arg(keys.staff, () => StaffInput) staffInp: StaffInput
	): Promise<boolean> {
		const hashPassword = await hash(password);
		const user = getRepository(User).create({
			...userInp,
			hashPassword,
			role: userRoles.STAFF,
		});
		await getRepository(User).save(user);

		await getRepository(Staff).save(
			getRepository(Staff).create({ ...staffInp, user })
		);
		return true;
	}
}
