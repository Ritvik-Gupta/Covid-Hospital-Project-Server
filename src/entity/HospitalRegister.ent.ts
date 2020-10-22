import { Field, ID, ObjectType } from "type-graphql";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { Hospital } from "./Hospital.ent";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class HospitalRegister {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => Date)
	@CreateDateColumn()
	joinDate: Date;

	@ManyToOne(() => Hospital, ({ register }) => register)
	@JoinColumn({ name: "hospitalId", referencedColumnName: "id" })
	hospital: Hospital;

	@Field(() => User)
	@OneToOne(() => User, ({ registeredAt }) => registeredAt)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	user: User;
}
