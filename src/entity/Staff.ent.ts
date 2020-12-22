import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Service } from "typedi";
import { Entity, EntityRepository, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Address } from "../model/Address.mod";
import { customRepository } from "../service/Custom.rep";
import { User } from "./User.ent";

@ObjectType()
@Entity()
export class Staff extends Address {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@Field(() => User)
	@OneToOne(() => User, ({ asStaff }) => asStaff)
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	asUser: User;
}

@InputType()
export class StaffInput extends Address implements Partial<Staff> {}

@Service()
@EntityRepository(Staff)
export class StaffRepository extends customRepository<Staff>({
	ifDefined: "Staff already exists",
	ifNotDefined: "No such Staff exists",
}) {}
