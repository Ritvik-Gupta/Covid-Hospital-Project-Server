import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { HospRegister } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(HospRegister)
export class HospRegisterRepository extends customRepository<HospRegister>({
	ifDefined: "User Already Registered To a Hospital",
	ifNotDefined: "User is not Registered to any Hospital",
}) {
	async areInSameHosp(userId_A: string, userId_B: string): Promise<string> {
		const record_A = await this.ifDefined({ userId: userId_A });
		const record_B = await this.ifDefined({ userId: userId_B });
		if (record_A.hospitalId !== record_B.hospitalId)
			throw Error("Users don't belong to the same Hospital");
		return record_A.hospitalId;
	}
}
