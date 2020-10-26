import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Admin } from "../entity/Admin.ent";

@Service()
@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {
	async isDef(userId: string): Promise<Admin> {
		const admin = await this.findOne({ where: { userId } });
		if (admin === undefined) throw new Error("No such Admin exists");
		return admin;
	}
}
