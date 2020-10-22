import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

(async () => {
	dotenv.config();
	await createConnection();

	const app = express();
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

	const schema = await buildSchema({
		resolvers: [__dirname + "/resolver/**/*.res.ts"],
	});
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({ req, res }),
		playground: {
			settings: { "request.credentials": "include" },
		},
	});

	apolloServer.applyMiddleware({ app });

	app.listen(process.env.PORT, () => {
		console.log("Graphql Server Up and Running on");
		console.log(`http://localhost:${process.env.PORT}/graphql`);
	});
})();
