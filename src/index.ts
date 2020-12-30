import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { createConnection, useContainer } from "typeorm";
import { customAuthChecker, customFormatError } from "./service/customOptions";

(async () => {
	dotenv.config();
	useContainer(Container);
	await createConnection();

	const schema = await buildSchema({
		resolvers: [__dirname + "/resolver/index.ts"],
		authChecker: customAuthChecker,
		container: Container,
		authMode: "error",
		validate: {
			validationError: {
				target: false,
				value: false,
			},
		},
		emitSchemaFile: {
			path: __dirname + "/schema.gql",
			commentDescriptions: true,
			sortedSchema: false,
		},
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({ req, res }),
		formatError: customFormatError,
		playground: {
			settings: { "request.credentials": "include" },
		},
	});

	const app = express();
	app.use(
		cors({
			origin: process.env.CORS_ORIGIN,
			credentials: true,
		})
	);
	app.use(
		session({
			name: process.env.COOKIE_NAME,
			secret: process.env.SESSION_SECRET as string,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24,
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			},
			saveUninitialized: false,
			resave: false,
		})
	);

	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(process.env.PORT, () => {
		console.log("\n\nGraphql Server Up and Running on");
		console.log(`http://localhost:${process.env.PORT}/graphql\n\n`);
	});
})();
