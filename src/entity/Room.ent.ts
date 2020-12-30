import { Field, ID, ObjectType } from "type-graphql";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Bed } from "./Bed.ent";
import { Hospital } from "./Hospital.ent";

@ObjectType()
@Entity()
export class Room {
	@Field(() => ID)
	@PrimaryColumn({ type: "integer" })
	roomNo: number;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@Field(() => Date)
	@CreateDateColumn()
	createDate: Date;

	@Field(() => [Bed])
	@OneToMany(() => Bed, ({ inRoom }) => inRoom, { cascade: true })
	hasBeds: Bed[];

	@ManyToOne(() => Hospital, ({ hasRooms }) => hasRooms)
	@JoinColumn({ name: "hospitalId", referencedColumnName: "id" })
	belongsTo: Hospital;
}
