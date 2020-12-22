import { IsEmail, Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Service } from "typedi";
import { Column, Entity, EntityRepository, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { customRepository } from "../service/Custom.rep";
import { Gender, UserRoles } from "../service/customTypes";
import { Admin } from "./Admin.ent";
import { Doctor } from "./Doctor.ent";
import { HospRegister } from "./HospRegister.ent";
import { Patient } from "./Patient.ent";
import { Staff } from "./Staff.ent";

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

	@Field(() => Gender)
	@Column({ type: "enum", enum: Gender })
	gender: Gender;

	@Field(() => String)
	@Column({ type: "varchar", unique: true })
	email: string;

	@Field(() => UserRoles)
	@Column({ type: "enum", enum: UserRoles })
	role: UserRoles;

	@Column({ type: "varchar" })
	password: string;

	@OneToOne(() => Patient, ({ asUser }) => asUser)
	asPatient: Patient;

	@OneToOne(() => Doctor, ({ asUser }) => asUser)
	asDoctor: Doctor;

	@OneToOne(() => Staff, ({ asUser }) => asUser)
	asStaff: Staff;

	@OneToOne(() => Admin, ({ asUser }) => asUser)
	asAdmin: Admin;

	@OneToOne(() => HospRegister, ({ forUser }) => forUser)
	registeredAt: HospRegister;
}

@InputType()
export class LoginInput implements Partial<User> {
	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => String)
	password: string;
}

@InputType()
export class UserInput extends LoginInput implements Partial<User> {
	@Field(() => String)
	@Length(1, 30)
	firstName: string;

	@Field(() => String, { nullable: true })
	@Length(1, 30)
	middleName: string;

	@Field(() => String)
	@Length(1, 30)
	lastName: string;

	@Field(() => Gender)
	gender: Gender;
}

@Service()
@EntityRepository(User)
export class UserRepository extends customRepository<User>({
	ifDefined: "User Already Registered",
	ifNotDefined: "No such User exists",
}) {}
