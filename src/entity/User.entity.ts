import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./Doctor.entity";
import { Patient } from "./Patient.entity";

export enum userRoles {
	PATIENT = "PATIENT",
	DOCTOR = "DOCTOR",
	STAFF = "STAFF",
}

@ObjectType()
@Entity()
export class User {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	userId: string;

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

	@OneToOne(() => Patient, patient => patient.user)
	patient: Patient;

	@OneToOne(() => Doctor, doctor => doctor.user)
	doctor: Doctor;
}
