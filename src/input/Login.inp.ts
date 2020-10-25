import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => String)
	password: string;
}
