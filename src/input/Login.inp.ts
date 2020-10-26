import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../entity/User.ent";

@InputType()
export class LoginInput implements Partial<User> {
	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => String)
	password: string;
}
