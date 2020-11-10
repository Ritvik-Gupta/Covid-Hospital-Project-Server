import { Service } from "typedi";
import { EntityRepository, AbstractRepository } from "typeorm";
import { Doctor } from "../entity/Doctor.ent";
import { DoctorInput } from "../input/Doctor.inp";

@Service()
@EntityRepository(Doctor)
export class DoctorRepository extends AbstractRepository<Doctor> {
	async isDef(userId: string): Promise<Doctor> {
		const doctor = await this.repository.findOne({ where: { userId } });
		if (doctor === undefined) throw new Error("No such Doctor exists");
		return doctor;
	}

	async create(inp: DoctorInput, userId: string): Promise<void> {
		await this.repository.insert({ ...inp, userId });
	}
}
