import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { BedRegister } from "../entity/BedRegister.ent";

@Service()
@EntityRepository(BedRegister)
export class BedRegisterRepository extends Repository<BedRegister> {
	async isNotDef(
		bedNo: number,
		roomNo: number,
		hospitalId: string,
		patientId: string
	): Promise<void> {
		const [, check] = await this.findAndCount({
			where: { bedNo, roomNo, hospitalId, patientId },
		});
		if (check !== 0) throw new Error("Bed already occupied");
	}
}
