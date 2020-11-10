import { Service } from "typedi";
import { EntityRepository, AbstractRepository } from "typeorm";
import { TestResult } from "../entity/TestResult.ent";
import { TestReasons } from "../service/customTypes";

@Service()
@EntityRepository(TestResult)
export class TestResultRepository extends AbstractRepository<TestResult> {
	async isNotDef(patientId: string): Promise<void> {
		const [, check] = await this.repository.findAndCount({ where: { patientId } });
		if (check !== 0) throw new Error("Test Result already published");
	}

	async create(patientId: string, reason: TestReasons, description?: string): Promise<void> {
		await this.repository.insert({ patientId, reason, description });
	}
}
