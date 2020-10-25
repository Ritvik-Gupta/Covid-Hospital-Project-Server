import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Staff } from "../entity/Staff.ent";

@Service()
@EntityRepository(Staff)
export class StaffRepository extends Repository<Staff> {
	async isDef(userId: string): Promise<Staff> {
		const staff = await this.findOne({ where: { userId } });
		if (staff === undefined) throw new Error("No such Staff exists");
		return staff;
	}
}
