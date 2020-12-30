import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Admin } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Admin)
export class AdminRepository extends customRepository<Admin>({
	ifDefined: "Admin already exists",
	ifNotDefined: "No such Admin exists",
}) {}
