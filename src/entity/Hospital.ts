import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Hospital {
	@Field(() => String)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => String)
	@Column({ type: "char", length: 30 })
	name: string;

	@Field(() => String)
	@Column({ type: "char", length: 30 })
	state: string;

	@Field(() => String)
	@Column({ type: "char", length: 30 })
	city: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "char", length: 10, nullable: true })
	pincode?: string;
}
