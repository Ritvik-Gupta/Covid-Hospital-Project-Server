import { ValidationError } from "class-validator";
import { Request, Response } from "express";
import { registerEnumType } from "type-graphql";

export enum UserRoles {
	PATIENT = "PATIENT",
	DOCTOR = "DOCTOR",
	STAFF = "STAFF",
	ADMIN = "ADMIN",
}
registerEnumType(UserRoles, { name: "UserRoles" });

export enum TestReasons {
	COVID = "COVID",
	MALARIA = "MALARIA",
	AIDS = "AIDS",
}
registerEnumType(TestReasons, { name: "TestReasons" });

export interface customCtx {
	req: Request & {
		session: Express.Session & { userId?: string };
	};
	res: Response;
}

export interface perfectCtx {
	req: Request & {
		session: Express.Session & { userId: string };
	};
	res: Response;
}

export type customGQLExtension = {
	exception: { validationErrors?: ValidationError[] };
};

export type customValidErr = Partial<ValidationError> & {
	property: string;
	constraints: any;
};

export type customGQLError = {
	message: string;
	exception: {
		validationErrors?: customValidErr[];
	};
};
