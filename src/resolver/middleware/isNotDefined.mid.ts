import { MiddlewareFn } from "type-graphql";
import { getRepository } from "typeorm";
import { Appointment } from "../../entity/Appointment.ent";
import { Bed } from "../../entity/Bed.ent";
import { HospitalRegister } from "../../entity/HospitalRegister.ent";
import { Room } from "../../entity/Room.ent";
import { User } from "../../entity/User.ent";
import { customCtx, keys } from "../../service/customTypes";

export const roomNotDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(Room).findAndCount({
		where: { hospitalId: args[keys.hospitalId], roomNo: args[keys.roomNo] },
	});
	if (check > 0) throw new Error("Room already created");
	return next();
};

export const bedNotDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(Bed).findAndCount({
		where: {
			bedNo: args[keys.bedNo],
			roomNo: args[keys.roomNo],
			hospitalId: args[keys.hospitalId],
		},
	});
	if (check > 0) throw new Error("Bed already created");
	return next();
};

export const userNotDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(User).findAndCount({
		where: { email: args[keys.user].email },
	});
	if (check > 0) throw new Error("User Already Registered with the Email");
	return next();
};

export const appointmentNotDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, check] = await getRepository(Appointment).findAndCount({
		where: { doctorId: args[keys.doctorId], patientId: args[keys.patientId] },
	});
	if (check > 0) throw new Error("Appointment already created");
	return next();
};

export const registerNotDef: MiddlewareFn<customCtx> = async ({ args }, next) => {
	const [, checkRegister] = await getRepository(HospitalRegister).findAndCount({
		where: { userId: args[keys.userId] },
	});
	if (checkRegister > 0) throw new Error("User Already Registered To a Hospital");
	return next();
};
