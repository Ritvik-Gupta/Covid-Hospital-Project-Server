import { getRepository } from "typeorm";
import { Appointment } from "../entity/Appointment.ent";
import { Bed } from "../entity/Bed.ent";
import { Hospital } from "../entity/Hospital.ent";
import { HospitalRegister } from "../entity/HospitalRegister.ent";
import { Room } from "../entity/Room.ent";
import { User } from "../entity/User.ent";
import { ArgValidator } from "../service/customTypes";

export const hospitalNotDef: ArgValidator = async ({ hospital: { name } }) => {
	const [, check] = await getRepository(Hospital).findAndCount({
		where: { name },
	});
	if (check !== 0) throw new Error("Hospital already created");
};

export const roomNotDef: ArgValidator = async ({ hospitalId, roomNo }) => {
	const [, check] = await getRepository(Room).findAndCount({
		where: { hospitalId, roomNo },
	});
	if (check !== 0) throw new Error("Room already created");
};

export const bedNotDef: ArgValidator = async ({ bedNo, roomNo, hospitalId }) => {
	const [, check] = await getRepository(Bed).findAndCount({
		where: { bedNo, roomNo, hospitalId },
	});
	if (check !== 0) throw new Error("Bed already created");
};

export const userNotDef: ArgValidator = async ({ user: { email } }) => {
	const [, check] = await getRepository(User).findAndCount({
		where: { email },
	});
	if (check !== 0) throw new Error("User Already Registered");
};

export const appointmentNotDef: ArgValidator = async ({ doctorId, patientId }) => {
	const [, check] = await getRepository(Appointment).findAndCount({
		where: { doctorId, patientId },
	});
	if (check !== 0) throw new Error("Appointment already created");
};

export const registerNotDef: ArgValidator = async ({ userId }) => {
	const [, checkRegister] = await getRepository(HospitalRegister).findAndCount({
		where: { userId },
	});
	if (checkRegister !== 0) throw new Error("User Already Registered To a Hospital");
};
