import { Field, ID, ObjectType } from "type-graphql";
import { Service } from "typedi";
import {
	CreateDateColumn,
	Entity,
	EntityRepository,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
} from "typeorm";
import { customRepository } from "../service/Custom.rep";
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

@Service()
@EntityRepository(Room)
export class RoomRepository extends customRepository<Room>({
	ifDefined: "Room already created",
	ifNotDefined: "No such Room exists",
}) {}
