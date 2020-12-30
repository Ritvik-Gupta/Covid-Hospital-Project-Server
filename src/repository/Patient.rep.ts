import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Patient } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Patient)
export class PatientRepository extends customRepository<Patient>({
	ifDefined: "Patient already exists",
	ifNotDefined: "No such Patient exists",
}) {}
