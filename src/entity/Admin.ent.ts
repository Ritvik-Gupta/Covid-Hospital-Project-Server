import { Field, ID, ObjectType } from "type-graphql";
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { Hospital } from "./Hospital.ent";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Admin {
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
	@OneToOne(() => User, ({ asAdmin }) => asAdmin)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	user: User;

	@OneToMany(() => Hospital, ({ admin }) => admin)
	hospitals: Hospital[];
}
