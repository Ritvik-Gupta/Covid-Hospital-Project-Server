import { Service } from "typedi";
import { EntityRepository, AbstractRepository } from "typeorm";
import { BedRegister } from "../entity/BedRegister.ent";

@Service()
@EntityRepository(BedRegister)
export class BedRegisterRepository extends AbstractRepository<BedRegister> {
	async isNotDef(
		bedNo: number,
		roomNo: number,
		hospitalId: string,
		patientId: string
	): Promise<void> {
		const [, check] = await this.repository.findAndCount({
			where: { bedNo, roomNo, hospitalId, patientId },
		});
		if (check !== 0) throw new Error("Bed already occupied");
	}

	async create(
		bedNo: number,
		roomNo: number,
		hospitalId: string,
		patientId: string
	): Promise<void> {
		await this.repository.insert({ bedNo, roomNo, hospitalId, patientId });
	}
}
