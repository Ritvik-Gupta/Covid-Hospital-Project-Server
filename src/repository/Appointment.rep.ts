import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { Appointment } from "../entity/Appointment.ent";

@Service()
@EntityRepository(Appointment)
export class AppointmentRepository extends AbstractRepository<Appointment> {
	async isNotDef(doctorId: string, patientId: string): Promise<void> {
		const [, check] = await this.repository.findAndCount({ where: { doctorId, patientId } });
		if (check !== 0) throw new Error("Appointment already created");
	}

	async create(doctorId: string, patientId: string): Promise<void> {
		await this.repository.insert({ doctorId, patientId });
	}
}
