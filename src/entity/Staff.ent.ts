import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Staff {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	state: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	city: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 10, nullable: true })
	pincode?: string;

	@Field(() => User)
	@OneToOne(() => User, ({ asStaff }) => asStaff)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	user: User;
}
