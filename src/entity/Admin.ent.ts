import { Field, ID, ObjectType } from "type-graphql";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Address } from "../model/Address.mod";
import { Hospital } from "./Hospital.ent";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Admin extends Address {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => User)
	@OneToOne(() => User, ({ asAdmin }) => asAdmin)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	asUser: User;

	@OneToMany(() => Hospital, ({ hasAdmin }) => hasAdmin)
	ownsHospitals: Hospital[];
}
