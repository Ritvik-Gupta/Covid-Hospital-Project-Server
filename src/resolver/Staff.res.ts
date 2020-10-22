import { hash } from "argon2";
import { Mutation, Resolver } from "type-graphql";
import { createQueryBuilder, getRepository } from "typeorm";
import { Staff } from "../entity/Staff.ent";
import { User, userRoles } from "../entity/User.ent";
import { userNotDef } from "../middleware/isNotDefined.mid";
import { ArgKey, ValidateArgs } from "../service/customTypes";
import { StaffInput } from "../input/Staff.inp";
import { UserInput } from "../input/User.inp";

@Resolver()
export class StaffResolver {
	@Mutation(() => Boolean)
	@ValidateArgs([userNotDef])
	async registerStaff(
		@ArgKey("user", () => UserInput) { password, ...userInp }: UserInput,
		@ArgKey("staff", () => StaffInput) staffInp: StaffInput
	): Promise<boolean> {
		const hashPassword = await hash(password);
		const user = getRepository(User).create({
			...userInp,
			hashPassword,
			role: userRoles.STAFF,
		});
		await getRepository(User).save(user);

		await createQueryBuilder()
			.insert()
			.into(Staff)
			.values({ ...staffInp, user })
			.execute();
		return true;
	}
}
