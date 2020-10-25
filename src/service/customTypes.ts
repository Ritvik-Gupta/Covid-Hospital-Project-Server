import { ValidationError } from "class-validator";
import { Request, Response } from "express";

export enum userRoles {
	PATIENT = "PATIENT",
	DOCTOR = "DOCTOR",
	STAFF = "STAFF",
}

export type customRequest = Request & {
	session: Express.Session & { userId?: string };
};

export interface customCtx {
	req: customRequest;
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
	validationErrors?: customValidErr[];
};
