import { Field, ID, ObjectType } from "type-graphql";
import { Service } from "typedi";
import {
	CreateDateColumn,
	Entity,
	EntityRepository,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import { customRepository } from "../service/Custom.rep";
import { Doctor } from "./Doctor.ent";
import { Patient } from "./Patient.ent";

@ObjectType()
@Entity()
export class Appointment {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	doctorId: string;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	patientId: string;

	@Field(() => Date)
	@CreateDateColumn()
	assignedDate: Date;

	@ManyToOne(() => Doctor, ({ appointments }) => appointments)
	@JoinColumn({ name: "doctorId", referencedColumnName: "userId" })
	withDoctor: Doctor;

	@ManyToOne(() => Patient, ({ appointments }) => appointments)
	@JoinColumn({ name: "patientId", referencedColumnName: "userId" })
	withPatient: Patient;
}

@Service()
@EntityRepository(Appointment)
export class AppointmentRepository extends customRepository<Appointment>({
	ifDefined: "Appointment already created",
	ifNotDefined: "Appointment not found",
}) {}
