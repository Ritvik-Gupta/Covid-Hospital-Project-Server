import { Request, Response } from "express";

export interface customCtx {
	req: Request & { session: Express.Session };
	res: Response;
}
