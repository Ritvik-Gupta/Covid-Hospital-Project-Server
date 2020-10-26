import { IsEmail, Length, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../entity/User.ent";

@InputType()
export class UserInput implements Partial<User> {
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
	@Length(5, 20)
	password: string;
}
