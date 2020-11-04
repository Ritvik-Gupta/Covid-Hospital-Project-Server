import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { TestReasons } from "../service/customTypes";
import { Patient } from "./Patient.ent";

@ObjectType()
@Entity()
export class TestResult {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	patientId: string;

	@Field(() => TestReasons)
	@Column({ type: "enum", enum: TestReasons })
	reason: TestReasons;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 200, nullable: true })
	description?: string;

	@Field(() => Patient)
	@OneToOne(() => Patient, ({ testResult }) => testResult)
	@JoinColumn({ name: "patientId", referencedColumnName: "userId" })
	forPatient: Patient;
}
