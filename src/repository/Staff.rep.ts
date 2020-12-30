import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Staff } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Staff)
export class StaffRepository extends customRepository<Staff>({
	ifDefined: "Staff already exists",
	ifNotDefined: "No such Staff exists",
}) {}
