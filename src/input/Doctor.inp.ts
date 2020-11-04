import { IsNumberString, IsUppercase, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Doctor } from "../entity/Doctor.ent";

@InputType()
export class DoctorInput implements Partial<Doctor> {
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

	@Field(() => String)
	@Length(2, 10)
	@IsUppercase()
	qualifaction: string;
}
