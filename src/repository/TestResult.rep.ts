import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { TestResult } from "../entity/TestResult.ent";

@Service()
@EntityRepository(TestResult)
export class TestResultRepository extends Repository<TestResult> {
	async isNotDef(patientId: string): Promise<void> {
		const [, check] = await this.findAndCount({ where: { patientId } });
		if (check !== 0) throw new Error("Test Result already published");
	}
}
