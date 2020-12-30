import { Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
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

	@OneToMany(() => PrescribedMed, ({ prescribedMed }) => prescribedMed)
	prescribedTo: PrescribedMed[];
}

@InputType()
export class MedicineInput implements Partial<Medicine> {
	@Field(() => String)
	@Length(5, 50)
	name: string;

	@Field(() => String)
	@Length(10, 200)
	description: string;
}
