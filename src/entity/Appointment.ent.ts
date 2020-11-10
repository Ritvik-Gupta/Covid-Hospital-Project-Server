import { Field, ID, ObjectType } from "type-graphql";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
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
