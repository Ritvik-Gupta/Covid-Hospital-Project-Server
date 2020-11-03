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
import { Admin } from "./Admin.ent";
import { HospRegister } from "./HospRegister.ent";
import { Room } from "./Room.ent";

@ObjectType()
@Entity()
export class Hospital {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => String)
	@Column({ type: "uuid" })
	adminId: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30, unique: true })
	name: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	state: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	city: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 10, nullable: true })
	pincode?: string;

	@Field(() => Date)
	@CreateDateColumn()
	createDate: Date;

	@Field(() => [Room])
	@OneToMany(() => Room, ({ belongsTo }) => belongsTo, { cascade: true })
	rooms: Room[];

	@Field(() => [HospRegister])
	@OneToMany(() => HospRegister, ({ hospital }) => hospital, { cascade: true })
	records: HospRegister[];

	@Field(() => Admin)
	@ManyToOne(() => Admin, ({ hospitals }) => hospitals)
	@JoinColumn({ name: "adminId", referencedColumnName: "userId" })
	admin: Admin;
}
