import { IsNumberString, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Patient } from "../entity/Patient.ent";
import { BloodGroup } from "../service/customTypes";

@InputType()
export class PatientInput implements Partial<Patient> {
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

	@Field(() => BloodGroup)
	bloodGroup: BloodGroup;
}
