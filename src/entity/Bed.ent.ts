import { Field, ID, ObjectType } from "type-graphql";
import { Service } from "typedi";
import {
	CreateDateColumn,
	Entity,
	EntityRepository,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { customRepository } from "../service/Custom.rep";
import { BedRegister } from "./BedRegister.ent";
import { Room } from "./Room.ent";

@ObjectType()
@Entity()
export class Bed {
	@Field(() => ID)
	@PrimaryColumn({ type: "integer" })
	bedNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "integer" })
	roomNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@Field(() => Date)
	@CreateDateColumn()
	createDate: Date;

	@ManyToOne(() => Room, ({ hasBeds }) => hasBeds)
	@JoinColumn([
		{ name: "roomNo", referencedColumnName: "roomNo" },
		{ name: "hospitalId", referencedColumnName: "hospitalId" },
	])
	inRoom: Room;

	@OneToOne(() => BedRegister, ({ forBed }) => forBed, { cascade: true })
	bedRecords: BedRegister;
}

@Service()
@EntityRepository(Bed)
export class BedRepository extends customRepository<Bed>({
	ifDefined: "Bed already created",
	ifNotDefined: "Information on Bed not found",
}) {}
