import { Field, ID, ObjectType } from "type-graphql";
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { Appointment } from "./Appointment.ent";
import { BedRegister } from "./BedRegister.ent";
import { PrescribedMed } from "./PrescribedMed.ent";
import { TestResult } from "./TestResult.ent";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Patient {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	state: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	city: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 10, nullable: true })
	pincode?: string;

	@Field(() => User)
	@OneToOne(() => User, ({ asPatient }) => asPatient)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	user: User;

	@OneToOne(() => TestResult, ({ patient }) => patient, { cascade: true })
	testResult: TestResult;

	@OneToOne(() => BedRegister, ({ patient }) => patient, { cascade: true })
	occupiedBed: BedRegister;

	@OneToMany(() => Appointment, ({ patient }) => patient, { cascade: true })
	appointments: Appointment[];

	@OneToMany(() => PrescribedMed, ({ patient }) => patient, { cascade: true })
	prescribedMeds: PrescribedMed[];
}
