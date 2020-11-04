import { Field, ID, ObjectType } from "type-graphql";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { Bed } from "./Bed.ent";
import { Patient } from "./Patient.ent";

@ObjectType()
@Entity()
export class BedRegister {
	@Field(() => ID)
	@PrimaryColumn({ type: "mediumint" })
	bedNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "mediumint" })
	roomNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	patientId: string;

	@Field(() => Date)
	@CreateDateColumn()
	occupiedAtDate: Date;

	@Field(() => Bed)
	@OneToOne(() => Bed, ({ bedRecords }) => bedRecords)
	@JoinColumn([
		{ name: "bedNo", referencedColumnName: "bedNo" },
		{ name: "roomNo", referencedColumnName: "roomNo" },
		{ name: "hospitalId", referencedColumnName: "hospitalId" },
	])
	forBed: Bed;

	@Field(() => Patient)
	@OneToOne(() => Patient, ({ occupiedBed }) => occupiedBed)
	@JoinColumn({ name: "patientId", referencedColumnName: "userId" })
	forPatient: Patient;
}
