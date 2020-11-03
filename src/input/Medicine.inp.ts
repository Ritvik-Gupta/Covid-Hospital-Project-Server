import { MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Medicine } from "../entity/Medicine.ent";

@InputType()
export class MedicineInput implements Partial<Medicine> {
	@Field(() => String)
	@MaxLength(50)
	name: string;

	@Field(() => String)
	@MaxLength(200)
	description: string;
}
