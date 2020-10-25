import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Doctor } from "../entity/Doctor.ent";

@Service()
@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor> {
	async isDef(userId: string): Promise<Doctor> {
		const doctor = await this.findOne({ where: { userId } });
		if (doctor === undefined) throw new Error("No such Doctor exists");
		return doctor;
	}
}
