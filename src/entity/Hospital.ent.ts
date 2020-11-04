import { Field, ID, ObjectType } from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "../model/Address.mod";
import { Admin } from "./Admin.ent";
import { HospRegister } from "./HospRegister.ent";
import { Room } from "./Room.ent";

@ObjectType()
@Entity()
export class Hospital extends Address {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => String)
	@Column({ type: "uuid" })
	adminId: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30, unique: true })
	name: string;

	@Field(() => Date)
	@CreateDateColumn()
	createDate: Date;

	@Field(() => [Room])
	@OneToMany(() => Room, ({ belongsTo }) => belongsTo, { cascade: true })
	hasRooms: Room[];

	@Field(() => [HospRegister])
	@OneToMany(() => HospRegister, ({ forHospital }) => forHospital, { cascade: true })
	userRecords: HospRegister[];

	@Field(() => Admin)
	@ManyToOne(() => Admin, ({ ownsHospitals }) => ownsHospitals)
	@JoinColumn({ name: "adminId", referencedColumnName: "userId" })
	hasAdmin: Admin;
}
