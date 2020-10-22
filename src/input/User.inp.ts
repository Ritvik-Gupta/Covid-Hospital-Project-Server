import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UserInput {
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
	@MinLength(5)
	@MaxLength(20)
	password: string;
}
