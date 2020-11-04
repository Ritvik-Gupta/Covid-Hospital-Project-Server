import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../entity/User.ent";
import { Gender } from "../service/customTypes";

@InputType()
export class UserInput implements Partial<User> {
	@Field(() => String)
	@Length(1, 30)
	firstName: string;

	@Field(() => String, { nullable: true })
	@Length(1, 30)
	middleName: string;

	@Field(() => String)
	@Length(1, 30)
	lastName: string;

	@Field(() => Gender)
	gender: Gender;

	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => String)
	@Length(5, 30)
	password: string;
}
