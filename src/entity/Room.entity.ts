import { Field, ID, ObjectType } from "type-graphql";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
} from "typeorm";
import { Bed } from "./Bed.entity";
import { Hospital } from "./Hospital.entity";

@ObjectType()
@Entity()
export class Room {
	@Field(() => ID)
	@PrimaryColumn({ type: "mediumint" })
	roomNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@ManyToOne(() => Hospital, hospital => hospital.rooms)
	@JoinColumn({ name: "hospitalId", referencedColumnName: "id" })
	belongsTo: Hospital;

	@Field(() => [Bed])
	@OneToMany(() => Bed, bed => bed.inRoom, { cascade: true })
	beds: Bed[];

	@Field(() => Date)
	@CreateDateColumn()
	createDate: Date;
}
