import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { HospRegister } from "../entity/HospRegister.ent";

@Service()
@EntityRepository(HospRegister)
export class HospRegisterRepository extends Repository<HospRegister> {
	async isDef(userId: string): Promise<HospRegister> {
		const register = await this.findOne({ where: { userId } });
		if (register === undefined)
			throw new Error("User is not Registered in any Hospital");
		return register;
	}

	async isNotDef(userId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { userId } });
		if (check !== 0) throw new Error("User Already Registered To a Hospital");
	}

	async areInSameHosp(user1Id: string, user2Id: string): Promise<void> {
		const register1 = await this.isDef(user1Id);
		const register2 = await this.isDef(user2Id);
		if (register1.hospitalId !== register2.hospitalId)
			throw new Error("Users don't belong to the same Hospital");
	}
}
