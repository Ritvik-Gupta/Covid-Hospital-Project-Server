import { Field, ID, ObjectType } from "type-graphql";
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { Appointment } from "./Appointment.ent";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Doctor {
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
	@OneToOne(() => User, ({ asDoctor }) => asDoctor)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	user: User;

	@OneToMany(() => Appointment, ({ doctor }) => doctor, { cascade: true })
	appointments: Appointment[];
}
