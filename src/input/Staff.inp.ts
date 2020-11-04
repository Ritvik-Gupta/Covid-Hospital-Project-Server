import { IsNumberString, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Staff } from "../entity/Staff.ent";

@InputType()
export class StaffInput implements Partial<Staff> {
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
