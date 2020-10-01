import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import { Container } from "typedi";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

import { HospitalResolver } from "./resolver/Hospital";
import { createConnection, useContainer } from "typeorm";

dotenv.config();
(async () => {
	useContainer(Container);
	await createConnection();

	const schema = await buildSchema({
		resolvers: [HospitalResolver],
		container: Container,
	});
	const apolloServer = new ApolloServer({ schema });

	const app = express();
	apolloServer.applyMiddleware({ app });

	app.listen(process.env.PORT, () => {
		console.log("Graphql Server Up and Running on");
		console.log(`https://localhost:${process.env.PORT}/graphql`);
	});
})();
