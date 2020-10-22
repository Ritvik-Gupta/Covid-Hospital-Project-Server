import { Request, Response } from "express";

export interface customCtx {
	req: Request & { session: Express.Session };
	res: Response;
}

export enum keys {
	bedNo = "bedNo",
	roomNo = "roomNo",
	user = "user",
	userId = "userId",
	hospital = "hospital",
	hospitalId = "hospitalId",
	doctor = "doctor",
	doctorId = "doctorId",
	patient = "patient",
	patientId = "patientId",
	staff = "staff",
	staffId = "staffId",
}
