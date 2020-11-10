import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { Admin } from "../entity/Admin.ent";
import { AdminInput } from "../input/Admin.inp";

@Service()
@EntityRepository(Admin)
export class AdminRepository extends AbstractRepository<Admin> {
	async isDef(userId: string): Promise<Admin> {
		const admin = await this.repository.findOne({ where: { userId } });
		if (admin === undefined) throw new Error("No such Admin exists");
		return admin;
	}

	async create(inp: AdminInput, userId: string): Promise<void> {
		await this.repository.insert({ ...inp, userId });
	}
}
