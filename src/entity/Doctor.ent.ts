import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Address } from "../model/Address.mod";
import { Appointment } from "./Appointment.ent";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Doctor extends Address {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	qualifaction: string;

	@Field(() => User)
	@OneToOne(() => User, ({ asDoctor }) => asDoctor)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	asUser: User;

	@OneToMany(() => Appointment, ({ withDoctor }) => withDoctor, { cascade: true })
	appointments: Appointment[];
}
