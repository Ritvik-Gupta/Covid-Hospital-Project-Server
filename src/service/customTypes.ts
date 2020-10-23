import { Request, Response } from "express";

export enum userRoles {
	PATIENT = "PATIENT",
	DOCTOR = "DOCTOR",
	STAFF = "STAFF",
}

export interface UserLogin {
	id: string;
	email: string;
	role: userRoles;
}

export interface customCtx {
	req: Request & { session: Express.Session & { user?: UserLogin } };
	res: Response;
}
