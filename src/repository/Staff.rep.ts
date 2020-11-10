import { Service } from "typedi";
import { EntityRepository, AbstractRepository } from "typeorm";
import { Staff } from "../entity/Staff.ent";
import { StaffInput } from "../input/Staff.inp";

@Service()
@EntityRepository(Staff)
export class StaffRepository extends AbstractRepository<Staff> {
	async isDef(userId: string): Promise<Staff> {
		const staff = await this.repository.findOne({ where: { userId } });
		if (staff === undefined) throw new Error("No such Staff exists");
		return staff;
	}

	async create(inp: StaffInput, userId: string): Promise<void> {
		await this.repository.insert({ ...inp, userId });
	}
}
