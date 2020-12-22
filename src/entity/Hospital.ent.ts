import { Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Service } from "typedi";
import {
	Column,
	CreateDateColumn,
	Entity,
	EntityRepository,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "../model/Address.mod";
import { customRepository } from "../service/Custom.rep";
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
	@Column({ type: "varchar", length: 50, unique: true })
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

@InputType()
export class HospitalInput extends Address implements Partial<Hospital> {
	@Field(() => String)
	@Length(5, 50)
	name: string;
}

@Service()
@EntityRepository(Hospital)
export class HospitalRepository extends customRepository<Hospital>({
	ifDefined: "Hospital has already been created",
	ifNotDefined: "No such Hospital exists",
}) {
	async checkAdmin(hospitalId: string, adminId: string): Promise<void> {
		const hospital = await this.ifDefined({ id: hospitalId });
		if (hospital.adminId !== adminId) throw new Error("Hospital does not belong to the Admin");
	}
}
