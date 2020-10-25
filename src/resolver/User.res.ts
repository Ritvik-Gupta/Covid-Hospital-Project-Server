import { verify } from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/User.ent";
import { DoctorInput } from "../input/Doctor.inp";
import { LoginInput } from "../input/Login.inp";
import { PatientInput } from "../input/Patient.inp";
import { StaffInput } from "../input/Staff.inp";
import { UserInput } from "../input/User.inp";
import { DoctorRepository } from "../repository/Doctor.rep";
import { PatientRepository } from "../repository/Patient.rep";
import { StaffRepository } from "../repository/Staff.rep";
import { UserRepository } from "../repository/User.rep";
import { customCtx, userRoles } from "../service/customTypes";

@Service()
@Resolver()
export class UserResolver {
	constructor(
		@InjectRepository() private readonly userRepo: UserRepository,
		@InjectRepository() private readonly staffRepo: StaffRepository,
		@InjectRepository() private readonly doctorRepo: DoctorRepository,
		@InjectRepository() private readonly patientRepo: PatientRepository
	) {}

	@Query(() => User)
	async currentUser(@Ctx() { req }: customCtx): Promise<User> {
		if (req.session.userId === undefined) throw new Error("No User Is Logged In");
		const user = await this.userRepo.isDef(req.session.userId);
		return user;
	}

	@Mutation(() => Boolean)
	async loginUser(
		@Ctx() { req }: customCtx,
		@Arg("login", () => LoginInput) { email, password }: LoginInput
	): Promise<boolean> {
		const user = await this.userRepo.isDefWithEmail(email);
		const isValidPassowrd = await verify(user.hashPassword, password);
		if (isValidPassowrd === false) throw new Error("Invalid Passowrd");
		req.session.userId = user.id;
		return true;
	}

	@Mutation(() => Boolean)
	async registerStaff(
		@Ctx() { req }: customCtx,
		@Arg("user", () => UserInput) userInp: UserInput,
		@Arg("staff", () => StaffInput) staffInp: StaffInput
	): Promise<boolean> {
		await this.userRepo.isNotDef(userInp.email);
		const user = await this.userRepo.createAndReturn(userInp, userRoles.STAFF);
		await this.staffRepo.insert({ ...staffInp, user });
		req.session.userId = user.id;
		return true;
	}

	@Mutation(() => Boolean)
	async registerDoctor(
		@Ctx() { req }: customCtx,
		@Arg("user", () => UserInput) userInp: UserInput,
		@Arg("doctor", () => DoctorInput) doctorInp: DoctorInput
	): Promise<boolean> {
		await this.userRepo.isNotDef(userInp.email);
		const user = await this.userRepo.createAndReturn(userInp, userRoles.DOCTOR);
		await this.doctorRepo.insert({ ...doctorInp, user });
		req.session.userId = user.id;
		return true;
	}

	@Mutation(() => Boolean)
	async registerPatient(
		@Ctx() { req }: customCtx,
		@Arg("user", () => UserInput) userInp: UserInput,
		@Arg("patient", () => PatientInput) patientInp: PatientInput
	): Promise<boolean> {
		await this.userRepo.isNotDef(userInp.email);
		const user = await this.userRepo.createAndReturn(userInp, userRoles.PATIENT);
		await this.patientRepo.insert({ ...patientInp, user });
		req.session.userId = user.id;
		return true;
	}
}
