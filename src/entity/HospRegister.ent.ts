import { Field, ID, ObjectType } from "type-graphql";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { CovidRegister } from "./CovidRegister.ent";
import { Hospital } from "./Hospital.ent";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class HospRegister {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => Date)
	@CreateDateColumn()
	joinDate: Date;

	@ManyToOne(() => Hospital, ({ userRecords }) => userRecords)
	@JoinColumn({ name: "hospitalId", referencedColumnName: "id" })
	forHospital: Hospital;

	@Field(() => User)
	@OneToOne(() => User, ({ registeredAt }) => registeredAt)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	forUser: User;

	@OneToMany(() => CovidRegister, ({ forRecord }) => forRecord)
	hasCovid: CovidRegister;
}
