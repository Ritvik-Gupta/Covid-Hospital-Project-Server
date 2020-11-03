import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { PrescribedMed } from "./PrescribedMed.ent";

@ObjectType()
@Entity()
export class Medicine {
	@Field(() => String)
	@PrimaryColumn({ type: "varchar", length: 50 })
	name: string;

	@Field(() => String)
	@Column({ type: "varchar", length: 200 })
	description: string;

	@OneToMany(() => PrescribedMed, ({ medicine }) => medicine)
	prescribedTo: PrescribedMed[];
}
