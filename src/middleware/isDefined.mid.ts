import { getRepository } from "typeorm";
import { Doctor } from "../entity/Doctor.ent";
import { Hospital } from "../entity/Hospital.ent";
import { Patient } from "../entity/Patient.ent";
import { Room } from "../entity/Room.ent";
import { Staff } from "../entity/Staff.ent";
import { User } from "../entity/User.ent";
import { ArgValidator } from "../service/customTypes";

export const hospitalDef: ArgValidator = async ({ hospitalId }) => {
	const [, check] = await getRepository(Hospital).findAndCount({
		where: { id: hospitalId },
	});
	if (check === 0) throw new Error("No such Hospital exists");
};

export const roomDef: ArgValidator = async ({ roomNo, hospitalId }) => {
	const [, check] = await getRepository(Room).findAndCount({
		where: { roomNo, hospitalId },
	});
	if (check === 0) throw new Error("No such Room exists");
};

export const userDef: ArgValidator = async ({ userId }) => {
	const [, check] = await getRepository(User).findAndCount({
		where: { id: userId },
	});
	if (check === 0) throw new Error("No such User exists");
};

export const staffDef: ArgValidator = async ({ staffId }) => {
	const [, check] = await getRepository(Staff).findAndCount({
		where: { userId: staffId },
	});
	if (check === 0) throw new Error("No such Staff exists");
};

export const doctorDef: ArgValidator = async ({ doctorId }) => {
	const [, check] = await getRepository(Doctor).findAndCount({
		where: { userId: doctorId },
	});
	if (check === 0) throw new Error("No such Doctor exists");
};

export const patientDef: ArgValidator = async ({ patientId }) => {
	const [, check] = await getRepository(Patient).findAndCount({
		where: { userId: patientId },
	});
	if (check === 0) throw new Error("No such Patient exists");
};
