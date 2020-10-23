import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Staff } from "../entity/Staff.ent";

@Service()
@EntityRepository(Staff)
export class StaffRepository extends Repository<Staff> {
	async isDef(userId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { userId } });
		if (check === 0) throw new Error("No such Staff exists");
	}
}
