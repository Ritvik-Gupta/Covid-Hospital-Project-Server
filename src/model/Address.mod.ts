import { Field, ObjectType } from "type-graphql";
import { Column } from "typeorm";

@ObjectType()
export abstract class Address {
	@Field(() => String)
	@Column({ type: "varchar", length: 50 })
	street: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 30 })
	city: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 6, nullable: true })
	pincode?: string;
}
