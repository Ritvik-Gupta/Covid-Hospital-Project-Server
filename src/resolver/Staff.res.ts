import { Arg, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { StaffInput } from "../input/Staff.inp";
import { UserInput } from "../input/User.inp";
import { StaffRepository } from "../repository/Staff.rep";
import { UserRepository } from "../repository/User.rep";
import { userRoles } from "../service/customTypes";

@Service()
@Resolver()
export class StaffResolver {
	constructor(
		@InjectRepository() private readonly userRepo: UserRepository,
		@InjectRepository() private readonly staffRepo: StaffRepository
	) {}

	@Mutation(() => Boolean)
	async registerStaff(
		@Arg("user", () => UserInput) userInp: UserInput,
		@Arg("staff", () => StaffInput) staffInp: StaffInput
	): Promise<boolean> {
		await this.userRepo.isNotDef(userInp.email);
		const user = await this.userRepo.createAndReturn(userInp, userRoles.STAFF);
		await this.staffRepo.insert({ ...staffInp, user });
		return true;
	}
}
