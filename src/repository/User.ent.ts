import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { User } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(User)
export class UserRepository extends customRepository<User>({
	ifDefined: "User Already Registered",
	ifNotDefined: "No such User exists",
}) {}
