import { Field, ObjectType } from "type-graphql";
import { Service } from "typedi";
import { Column, Entity, EntityRepository, OneToMany, PrimaryColumn } from "typeorm";
import { customRepository } from "../service/Custom.rep";
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

@Service()
@EntityRepository(Medicine)
export class MedicineRepository extends customRepository<Medicine>({
	ifDefined: "Medicine has already been created",
	ifNotDefined: "No such Medicine exists",
}) {}
