import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Bed } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(Bed)
export class BedRepository extends customRepository<Bed>({
	ifDefined: "Bed already created",
	ifNotDefined: "Information on Bed not found",
}) {}
