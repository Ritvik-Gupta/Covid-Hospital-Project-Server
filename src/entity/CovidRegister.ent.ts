import { Field, ID, ObjectType } from "type-graphql";
import { Service } from "typedi";
import {
	CreateDateColumn,
	Entity,
	EntityRepository,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import { customRepository } from "../service/Custom.rep";
import { CovidEntry } from "../service/customTypes";
import { HospRegister } from "./HospRegister.ent";

@ObjectType()
@Entity()
export class CovidRegister {
	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	hospitalId: string;

	@Field(() => ID)
	@PrimaryColumn({ type: "uuid" })
	patientId: string;

	@Field(() => CovidEntry)
	@PrimaryColumn({ type: "enum", enum: CovidEntry })
	entry: CovidEntry;

	@Field(() => Date)
	@CreateDateColumn()
	entryDate: Date;

	@ManyToOne(() => HospRegister, ({ hasCovid }) => hasCovid)
	@JoinColumn([
		{ name: "patientId", referencedColumnName: "userId" },
		{ name: "hospitalId", referencedColumnName: "hospitalId" },
	])
	forRecord: HospRegister;
}

@Service()
@EntityRepository(CovidRegister)
export class CovidRegisterRepository extends customRepository<CovidRegister>({
	ifDefined: "Covid Record for the Patient already exists",
	ifNotDefined: "No Covid Record found for the Patient",
}) {
	async checkLastRecord(patientId: string, entry: CovidEntry): Promise<void> {
		const record = await this.repository
			.createQueryBuilder("record")
			.where("record.patientId = :patientId", { patientId })
			.orderBy("record.entryDate", "DESC")
			.limit(1)
			.getOne();

		if (record === undefined) throw new Error("No Record Found for the Patient");
		if (record.entry !== entry) throw new Error("Invalid Entry provided for the Latest Record");
	}

	async addAffectedRecord(patientId: string, hospitalId: string): Promise<void> {
		await this.ifNotDefined({ patientId });
		await this.repository.insert({ patientId, hospitalId, entry: CovidEntry.AFFECTED });
	}
}
