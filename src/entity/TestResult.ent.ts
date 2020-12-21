import { Field, ID, ObjectType } from "type-graphql";
import { Service } from "typedi";
import { Column, Entity, EntityRepository, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { customRepository } from "../service/Custom.rep";
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

@Service()
@EntityRepository(TestResult)
export class TestResultRepository extends customRepository<TestResult>({
	ifDefined: "Test Result already published",
	ifNotDefined: "Test Result not found",
}) {}
