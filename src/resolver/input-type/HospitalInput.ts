import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";

@InputType()
export class HospitalInput {
	@Field(() => String)
	@MaxLength(30)
	name: string;

	@Field(() => String)
	@MaxLength(30)
	state: string;

	@Field(() => String)
	@MaxLength(30)
	city: string;

	@Field(() => String, { nullable: true })
	@MaxLength(10)
	pincode?: string;
}
