import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Address } from "../model/Address.mod";
import { BloodGroup } from "../service/customTypes";
import { Appointment } from "./Appointment.ent";
import { BedRegister } from "./BedRegister.ent";
import { PrescribedMed } from "./PrescribedMed.ent";
import { TestResult } from "./TestResult.ent";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Patient extends Address {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => BloodGroup)
	@Column({ type: "enum", enum: BloodGroup })
	bloodGroup: BloodGroup;

	@Field(() => User)
	@OneToOne(() => User, ({ asPatient }) => asPatient)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	asUser: User;

	@OneToOne(() => TestResult, ({ forPatient }) => forPatient, { cascade: true })
	testResult: TestResult;

	@OneToOne(() => BedRegister, ({ forPatient }) => forPatient, { cascade: true })
	occupiedBed: BedRegister;

	@OneToMany(() => Appointment, ({ withPatient }) => withPatient, { cascade: true })
	appointments: Appointment[];

	@OneToMany(() => PrescribedMed, ({ forPatient }) => forPatient, { cascade: true })
	prescribedMeds: PrescribedMed[];
}
