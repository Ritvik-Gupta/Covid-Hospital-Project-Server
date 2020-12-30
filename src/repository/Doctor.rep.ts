import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Doctor } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Doctor)
export class DoctorRepository extends customRepository<Doctor>({
	ifDefined: "Doctor already exists",
	ifNotDefined: "No such Doctor exists",
}) {}
