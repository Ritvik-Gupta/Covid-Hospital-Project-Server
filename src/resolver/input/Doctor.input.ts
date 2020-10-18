import { IsEmail, IsNumberString, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class DoctorInput {
	@Field(() => String)
	@MaxLength(30)
	firstName: string;

	@Field(() => String, { nullable: true })
	@MaxLength(30)
	middleName: string;

	@Field(() => String)
	@MaxLength(30)
	lastName: string;

	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => String)
	@MaxLength(30)
	state: string;

	@Field(() => String)
	@MaxLength(30)
	city: string;

	@Field(() => String, { nullable: true })
	@MinLength(10)
	@MaxLength(10)
	@IsNumberString()
	pincode?: string;

	@Field(() => String)
	@MinLength(5)
	@MaxLength(20)
	password: string;
}
