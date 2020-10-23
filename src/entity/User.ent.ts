import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./Doctor.ent";
import { HospitalRegister } from "./HospitalRegister.ent";
import { Patient } from "./Patient.ent";
import { Staff } from "./Staff.ent";
import { userRoles } from "../service/customTypes";

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

	@Field(() => String)
	@Column({ type: "enum", enum: userRoles })
	role: userRoles;

	@Column({ type: "varchar" })
	hashPassword: string;

	@OneToOne(() => Patient, ({ user }) => user)
	asPatient: Patient;

	@OneToOne(() => Doctor, ({ user }) => user)
	asDoctor: Doctor;

	@OneToOne(() => Staff, ({ user }) => user)
	asStaff: Staff;

	@OneToOne(() => HospitalRegister, ({ user }) => user)
	registeredAt: HospitalRegister;
}
