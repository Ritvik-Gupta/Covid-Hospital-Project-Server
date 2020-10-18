import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { BedResolver } from "./resolver/Bed.resolver";
import { DoctorResolver } from "./resolver/Doctor.resolver";
import { HospitalResolver } from "./resolver/Hospital.resolver";
import { PatientResolver } from "./resolver/Patient.resolver";
import { RoomResolver } from "./resolver/Room.resolver";

dotenv.config();
(async () => {
	await createConnection();

	const schema = await buildSchema({
		resolvers: [
			HospitalResolver,
			BedResolver,
			RoomResolver,
			PatientResolver,
			DoctorResolver,
		],
	});
	const apolloServer = new ApolloServer({ schema });

	const app = express();
	apolloServer.applyMiddleware({ app });

	app.listen(process.env.PORT, () => {
		console.log("Graphql Server Up and Running on");
		console.log(`http://localhost:${process.env.PORT}/graphql`);
	});
})();
