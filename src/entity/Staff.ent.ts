import { Field, ID, ObjectType } from "type-graphql";
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Address } from "../model/Address.mod";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Staff extends Address {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => User)
	@OneToOne(() => User, ({ asStaff }) => asStaff)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	asUser: User;
}
