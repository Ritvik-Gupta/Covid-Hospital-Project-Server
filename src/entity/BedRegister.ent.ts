import { Field, ID, ObjectType } from "type-graphql";
import { Service } from "typedi";
import {
	CreateDateColumn,
	Entity,
	EntityRepository,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { customRepository } from "../service/Custom.rep";
import { Bed } from "./Bed.ent";
import { Patient } from "./Patient.ent";

@ObjectType()
@Entity()
export class BedRegister {
	@Field(() => ID)
	@PrimaryColumn({ type: "integer" })
	bedNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "integer" })
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

@Service()
@EntityRepository(BedRegister)
export class BedRegisterRepository extends customRepository<BedRegister>({
	ifDefined: "Bed is currently occupied",
	ifNotDefined: "Bed is not occupied",
}) {}
