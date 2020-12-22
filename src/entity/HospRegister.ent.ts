import { Field, ID, ObjectType } from "type-graphql";
import { Service } from "typedi";
import {
	CreateDateColumn,
	Entity,
	EntityRepository,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { customRepository } from "../service/Custom.rep";
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

@Service()
@EntityRepository(HospRegister)
export class HospRegisterRepository extends customRepository<HospRegister>({
	ifDefined: "User Already Registered To a Hospital",
	ifNotDefined: "User is not Registered to any Hospital",
}) {
	async areInSameHosp(userId_A: string, userId_B: string): Promise<string> {
		const record_A = await this.ifDefined({ userId: userId_A });
		const record_B = await this.ifDefined({ userId: userId_B });
		if (record_A.hospitalId !== record_B.hospitalId)
			throw new Error("Users don't belong to the same Hospital");
		return record_A.hospitalId;
	}
}
