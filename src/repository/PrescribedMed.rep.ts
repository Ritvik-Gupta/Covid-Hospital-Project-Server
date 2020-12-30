import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { PrescribedMed } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(PrescribedMed)
export class PrescribedMedRepository extends customRepository<PrescribedMed>({
	ifDefined: "Prescription already exists",
	ifNotDefined: "No such Prescription exists",
}) {}
