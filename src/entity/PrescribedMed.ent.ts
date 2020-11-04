import { Field, ObjectType } from "type-graphql";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import { Medicine } from "./Medicine.ent";
import { Patient } from "./Patient.ent";

@ObjectType()
@Entity()
export class PrescribedMed {
	@Field(() => String)
	@PrimaryColumn({ type: "varchar", length: 50 })
	medName: string;

	@Field(() => String)
	@PrimaryColumn({ type: "uuid" })
	patientId: string;

	@Field(() => Date)
	@CreateDateColumn()
	prescriptionDate: Date;

	@ManyToOne(() => Medicine, ({ prescribedTo }) => prescribedTo)
	@JoinColumn({ name: "medName", referencedColumnName: "name" })
	medicine: Medicine;

	@ManyToOne(() => Patient, ({ prescribedMeds }) => prescribedMeds)
	@JoinColumn({ name: "patientId", referencedColumnName: "userId" })
	patient: Patient;
}