import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { TestResult } from "../entity";
import { customRepository } from "../service";

@Service()
@EntityRepository(TestResult)
export class TestResultRepository extends customRepository<TestResult>({
	ifDefined: "Test Result already published",
	ifNotDefined: "Test Result not found",
}) {}
