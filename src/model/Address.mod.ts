import { IsNumberString, Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column } from "typeorm";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class Address {
	@Field(() => String)
	@Column({ type: "varchar", length: 50 })
	@Length(5, 50)
	street: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	@Length(5, 50)
	city: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 6, nullable: true })
	@Length(6, 6)
	@IsNumberString()
	pincode?: string;
}
