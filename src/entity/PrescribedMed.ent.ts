import { Field, ObjectType } from "type-graphql";
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
import { Medicine } from "./Medicine.ent";
import { Patient } from "./Patient.ent";

@ObjectType()
@Entity()
export class PrescribedMed {
	@Field(() => String)
	@PrimaryColumn({ type: "varchar", length: 50 })
	medicineName: string;

	@Field(() => String)
	@PrimaryColumn({ type: "uuid" })
	patientId: string;

	@Field(() => Date)
	@CreateDateColumn()
	prescriptionDate: Date;

	@ManyToOne(() => Medicine, ({ prescribedTo }) => prescribedTo)
	@JoinColumn({ name: "medicineName", referencedColumnName: "name" })
	prescribedMed: Medicine;

	@ManyToOne(() => Patient, ({ prescribedMeds }) => prescribedMeds)
	@JoinColumn({ name: "patientId", referencedColumnName: "userId" })
	forPatient: Patient;
}

@Service()
@EntityRepository(PrescribedMed)
export class PrescribedMedRepository extends customRepository<PrescribedMed>({
	ifDefined: "Prescription already exists",
	ifNotDefined: "No such Prescription exists",
}) {}
