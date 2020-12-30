import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { BedRegister } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(BedRegister)
export class BedRegisterRepository extends customRepository<BedRegister>({
	ifDefined: "Bed is currently occupied",
	ifNotDefined: "Bed is not occupied",
}) {}
