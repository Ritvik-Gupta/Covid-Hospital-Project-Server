import { Field, ID, ObjectType } from "type-graphql";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import { CovidEntry } from "../service/customTypes";
import { HospRegister } from "./HospRegister.ent";

@ObjectType()
@Entity()
export class CovidRegister {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	patientId: string;

	@Field(() => CovidEntry)
	@PrimaryColumn({ type: "enum", enum: CovidEntry })
	entry: CovidEntry;

	@Field(() => Date)
	@CreateDateColumn()
	entryDate: Date;

	@ManyToOne(() => HospRegister, ({ hasCovid }) => hasCovid)
	@JoinColumn([
		{ name: "patientId", referencedColumnName: "userId" },
		{ name: "hospitalId", referencedColumnName: "hospitalId" },
	])
	forRecord: HospRegister;
}
