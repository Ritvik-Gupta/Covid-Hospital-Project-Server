import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Appointment } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Appointment)
export class AppointmentRepository extends customRepository<Appointment>({
	ifDefined: "Appointment already created",
	ifNotDefined: "Appointment not found",
}) {}
