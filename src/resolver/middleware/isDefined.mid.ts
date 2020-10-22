import { MiddlewareFn } from "type-graphql";
import { getRepository } from "typeorm";
import { Doctor } from "../../entity/Doctor.ent";
import { Hospital } from "../../entity/Hospital.ent";
import { Patient } from "../../entity/Patient.ent";
import { Room } from "../../entity/Room.ent";
import { Staff } from "../../entity/Staff.ent";
import { User } from "../../entity/User.ent";
import { customCtx, keys } from "../../service/customTypes";

export const hospitalDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(Hospital).findAndCount({
		where: { id: args[keys.hospitalId] },
	});
	if (check === 0) throw new Error("No such Hospital exists");
	return next();
};

export const roomDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(Room).findAndCount({
		where: {
			roomNo: args[keys.roomNo],
			hospitalId: args[keys.hospitalId],
		},
	});
	if (check === 0) throw new Error("No such Room exists");
	return next();
};

export const userDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(User).findAndCount({
		where: { id: args[keys.userId] },
	});
	if (check === 0) throw new Error("No such User exists");
	return next();
};

export const staffDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(Staff).findAndCount({
		where: { userId: args[keys.staffId] },
	});
	if (check === 0) throw new Error("No such Staff exists");
	return next();
};

export const doctorDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(Doctor).findAndCount({
		where: { userId: args[keys.doctorId] },
	});
	if (check === 0) throw new Error("No such Doctor exists");
	return next();
};

export const patientDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(Patient).findAndCount({
		where: { userId: args[keys.patientId] },
	});
	if (check === 0) throw new Error("No such Patient exists");
	return next();
};
