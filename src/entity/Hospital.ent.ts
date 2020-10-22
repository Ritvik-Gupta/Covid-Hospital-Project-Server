import { Field, ID, ObjectType } from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { HospitalRegister } from "./HospitalRegister.ent";
import { Room } from "./Room.ent";

@ObjectType()
@Entity()
export class Hospital {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

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

	@Field(() => [HospitalRegister])
	@OneToMany(() => HospitalRegister, ({ hospital }) => hospital, { cascade: true })
	register: HospitalRegister[];
}
