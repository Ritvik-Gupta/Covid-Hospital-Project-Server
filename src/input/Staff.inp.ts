import { IsNumberString, Length, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Staff } from "../entity/Staff.ent";

@InputType()
export class StaffInput implements Partial<Staff> {
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
