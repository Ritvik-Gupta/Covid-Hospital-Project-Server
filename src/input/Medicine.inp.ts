import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Medicine } from "../entity/Medicine.ent";

@InputType()
export class MedicineInput implements Partial<Medicine> {
	@Field(() => String)
	@Length(5, 50)
	name: string;

	@Field(() => String)
	@Length(10, 200)
	description: string;
}
