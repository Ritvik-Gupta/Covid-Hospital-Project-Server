import { IsNumberString, Length, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Hospital } from "../entity/Hospital.ent";

@InputType()
export class HospitalInput implements Partial<Hospital> {
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
	@Length(10, 10)
	@IsNumberString()
	pincode?: string;
}
