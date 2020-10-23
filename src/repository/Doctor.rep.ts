import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Doctor } from "../entity/Doctor.ent";

@Service()
@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor> {
	async isDef(userId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { userId } });
		if (check === 0) throw new Error("No such Doctor exists");
	}
}
