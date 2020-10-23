import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { Appointment } from "../entity/Appointment.ent";

@Service()
@EntityRepository(Appointment)
export class AppointmentRepository extends Repository<Appointment> {
	async isNotDef(doctorId: string, patientId: string) {
		const [, check] = await this.findAndCount({ where: { doctorId, patientId } });
		if (check !== 0) throw new Error("Appointment already created");
	}
}
