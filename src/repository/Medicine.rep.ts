import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Medicine } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Medicine)
export class MedicineRepository extends customRepository<Medicine>({
	ifDefined: "Medicine has already been created",
	ifNotDefined: "No such Medicine exists",
}) {}
