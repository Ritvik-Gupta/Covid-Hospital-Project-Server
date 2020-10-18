import { Field, ID, ObjectType } from "type-graphql";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import { Room } from "./Room.entity";

@ObjectType()
@Entity()
export class Bed {
	@Field(() => ID)
	@PrimaryColumn({ type: "mediumint" })
	bedNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "mediumint" })
	roomNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@ManyToOne(() => Room, room => room.beds)
	@JoinColumn([
		{ name: "roomNo", referencedColumnName: "roomNo" },
		{ name: "hospitalId", referencedColumnName: "hospitalId" },
	])
	inRoom: Room;

	@Field(() => Date)
	@CreateDateColumn()
	createDate: Date;
}
