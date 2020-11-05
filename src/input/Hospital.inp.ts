import { IsNumberString, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Hospital } from "../entity/Hospital.ent";

@InputType()
export class HospitalInput implements Partial<Hospital> {
	@Field(() => String)
	@Length(5, 50)
	name: string;

	@Field(() => String)
	@Length(5, 50)
	street: string;

	@Field(() => String)
	@Length(5, 30)
	city: string;

	@Field(() => String, { nullable: true })
	@Length(6, 6)
	@IsNumberString()
	pincode?: string;
}
