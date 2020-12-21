import { hash, verify } from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/User.ent";
import { AdminInput } from "../input/Admin.inp";
import { DoctorInput } from "../input/Doctor.inp";
import { LoginInput } from "../input/Login.inp";
import { PatientInput } from "../input/Patient.inp";
import { StaffInput } from "../input/Staff.inp";
import { UserInput } from "../input/User.inp";
import { AdminRepository } from "../entity/Admin.ent";
import { DoctorRepository } from "../entity/Doctor.ent";
import { PatientRepository } from "../entity/Patient.ent";
import { StaffRepository } from "../entity/Staff.ent";
import { UserRepository } from "../entity/User.ent";
import { customCtx, UserRoles } from "../service/customTypes";

@Service()
@Resolver()
export class UserResolver {
	constructor(
		@InjectRepository() private readonly userRepo: UserRepository,
		@InjectRepository() private readonly adminRepo: AdminRepository,
		@InjectRepository() private readonly staffRepo: StaffRepository,
		@InjectRepository() private readonly doctorRepo: DoctorRepository,
		@InjectRepository() private readonly patientRepo: PatientRepository
	) {}

	@Query(() => User)
	async currentUser(@Ctx() { req }: customCtx): Promise<User> {
		if (req.session.userId === undefined) throw new Error("No User Is Logged In");
		const user = await this.userRepo.isDef({ id: req.session.userId });
		return user;
	}

	@Mutation(() => Boolean)
	async login(
		@Ctx() { req }: customCtx,
		@Arg("params", () => LoginInput) { email, password }: LoginInput
	): Promise<boolean> {
		if (req.session.userId !== undefined) throw new Error("User already Logged In");
		const user = await this.userRepo.isDef({ email });
		const isValidPassowrd = await verify(user.password, password);
		if (isValidPassowrd === false) throw new Error("Invalid Passowrd");
		req.session.userId = user.id;
		return true;
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: customCtx): Promise<boolean> {
		if (req.session.userId === undefined) throw new Error("No User is Logged In");
		return new Promise(resolve =>
			req.session.destroy(() => {
				res.clearCookie(process.env.COOKIE_NAME as string);
				resolve(true);
			})
		);
	}

	@Mutation(() => Boolean)
	async registerAsStaff(
		@Ctx() { req }: customCtx,
		@Arg("user", () => UserInput) { password, ...userInp }: UserInput,
		@Arg("staff", () => StaffInput) staffInp: StaffInput
	): Promise<boolean> {
		if (req.session.userId !== undefined) throw new Error("User already Logged In");
		await this.userRepo.isNotDef({ email: userInp.email });
		const hashPassword = await hash(password);
		const { id } = await this.userRepo.create({
			...userInp,
			password: hashPassword,
			role: UserRoles.STAFF,
		});
		await this.staffRepo.create({ ...staffInp, userId: id });
		req.session.userId = id;
		return true;
	}

	@Mutation(() => Boolean)
	async registerAsDoctor(
		@Ctx() { req }: customCtx,
		@Arg("user", () => UserInput) { password, ...userInp }: UserInput,
		@Arg("doctor", () => DoctorInput) doctorInp: DoctorInput
	): Promise<boolean> {
		if (req.session.userId !== undefined) throw new Error("User already Logged In");
		await this.userRepo.isNotDef({ email: userInp.email });
		const hashPassword = await hash(password);
		const { id } = await this.userRepo.create({
			...userInp,
			password: hashPassword,
			role: UserRoles.DOCTOR,
		});
		await this.doctorRepo.create({ ...doctorInp, userId: id });
		req.session.userId = id;
		return true;
	}

	@Mutation(() => Boolean)
	async registerAsPatient(
		@Ctx() { req }: customCtx,
		@Arg("user", () => UserInput) { password, ...userInp }: UserInput,
		@Arg("patient", () => PatientInput) patientInp: PatientInput
	): Promise<boolean> {
		if (req.session.userId !== undefined) throw new Error("User already Logged In");
		await this.userRepo.isNotDef({ email: userInp.email });
		const hashPassword = await hash(password);
		const { id } = await this.userRepo.create({
			...userInp,
			password: hashPassword,
			role: UserRoles.PATIENT,
		});
		await this.patientRepo.create({ ...patientInp, userId: id });
		req.session.userId = id;
		return true;
	}

	@Mutation(() => Boolean)
	async registerAsAdmin(
		@Ctx() { req }: customCtx,
		@Arg("user", () => UserInput) { password, ...userInp }: UserInput,
		@Arg("admin", () => AdminInput) adminInp: AdminInput
	): Promise<boolean> {
		if (req.session.userId !== undefined) throw new Error("User already Logged In");
		await this.userRepo.isNotDef({ email: userInp.email });
		const hashPassword = await hash(password);
		const { id } = await this.userRepo.create({
			...userInp,
			password: hashPassword,
			role: UserRoles.ADMIN,
		});
		await this.adminRepo.create({ ...adminInp, userId: id });
		req.session.userId = id;
		return true;
	}
}
