import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { HospitalRegister } from "../entity/HospitalRegister.ent";

@Service()
@EntityRepository(HospitalRegister)
export class HospitalRegisterRepository extends Repository<HospitalRegister> {
	async isNotDef(userId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { userId } });
		if (check !== 0) throw new Error("User Already Registered To a Hospital");
	}
}
