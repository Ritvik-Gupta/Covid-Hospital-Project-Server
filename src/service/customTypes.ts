import { Request, Response } from "express";
import { Arg, ArgOptions, createMethodDecorator, ResolverData } from "type-graphql";
import { ReturnTypeFunc } from "type-graphql/dist/decorators/types";
import { DoctorInput } from "../input/Doctor.inp";
import { HospitalInput } from "../input/Hospital.inp";
import { PatientInput } from "../input/Patient.inp";
import { StaffInput } from "../input/Staff.inp";
import { UserInput } from "../input/User.inp";

export interface customCtx {
	req: Request & { session: Express.Session };
	res: Response;
}

export type argDict = {
	bedNo: number;
	roomNo: number;
	userId: string;
	staffId: string;
	doctorId: string;
	patientId: string;
	hospitalId: string;
	user: UserInput;
	staff: StaffInput;
	doctor: DoctorInput;
	patient: PatientInput;
	hospital: HospitalInput;
};

export type ArgValidator = (args: argDict, context: customCtx) => Promise<void>;

export const ValidateArgs = (middlewares: ArgValidator[]) =>
	createMethodDecorator(async ({ args, context }: ResolverData<customCtx>, next) => {
		for (let middleware of middlewares) await middleware(args as argDict, context);
		return next();
	});

export const ArgKey = (
	name: keyof argDict,
	returnTypeFunc: ReturnTypeFunc,
	options?: ArgOptions
) => Arg(name, returnTypeFunc, options);
