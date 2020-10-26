import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Medicine {
	@Field(() => String)
	@PrimaryColumn({ type: "varchar", length: 50 })
	name: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 200 })
	description: string;
}
