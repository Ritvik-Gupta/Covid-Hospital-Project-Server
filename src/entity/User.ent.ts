import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./Doctor.ent";
import { HospRegister } from "./HospRegister.ent";
import { Patient } from "./Patient.ent";
import { Staff } from "./Staff.ent";
import { UserRoles } from "../service/customTypes";
import { Admin } from "./Admin.ent";

@ObjectType()
@Entity()
export class User {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	firstName: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 30, nullable: true })
	middleName?: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	lastName: string;

	@Field(() => String)
	@Column({ type: "varchar", unique: true })
	email: string;

	@Field(() => UserRoles)
	@Column({ type: "enum", enum: UserRoles })
	role: UserRoles;

	@Column({ type: "varchar" })
	password: string;

	@OneToOne(() => Patient, ({ user }) => user)
	asPatient: Patient;

	@OneToOne(() => Doctor, ({ user }) => user)
	asDoctor: Doctor;

	@OneToOne(() => Staff, ({ user }) => user)
	asStaff: Staff;

	@OneToOne(() => Admin, ({ user }) => user)
	asAdmin: Admin;

	@OneToOne(() => HospRegister, ({ user }) => user)
	registeredAt: HospRegister;
}
