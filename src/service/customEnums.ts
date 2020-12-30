import { registerEnumType } from "type-graphql";

export enum UserRoles {
	PATIENT = "PATIENT",
	DOCTOR = "DOCTOR",
	STAFF = "STAFF",
	ADMIN = "ADMIN",
}
registerEnumType(UserRoles, { name: "UserRoles" });

export enum BloodGroup {
	A_PLUS = "A+",
	A_MINUS = "A-",
	B_PLUS = "B+",
	B_MINUS = "B-",
	AB_PLUS = "AB+",
	AB_MINUS = "AB-",
	O_PLUS = "O+",
	O_MINUS = "O-",
}
registerEnumType(BloodGroup, { name: "BloodGroup" });

export enum Gender {
	MALE = "M",
	FEMALE = "F",
	TRANS = "T",
}
registerEnumType(Gender, { name: "Gender" });

export enum TestReasons {
	COVID = "COVID",
	MALARIA = "MALARIA",
	AIDS = "AIDS",
	DENGUE = "DENGUE",
	VIRAL_FEVER = "VIRAL_FEVER",
}
registerEnumType(TestReasons, { name: "TestReasons" });

export enum CovidEntry {
	AFFECTED = "AFFECTED",
	RECOVERED = "RECOVERED",
	DEAD = "DEAD",
}
registerEnumType(CovidEntry, { name: "CovidEntry" });
