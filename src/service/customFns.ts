import { GraphQLError } from "graphql";
import { AuthChecker } from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../entity/User.ent";
import {
	customCtx,
	customGQLError,
	customGQLExtension,
	userRoles,
} from "./customTypes";

export const customFormatError = (error: GraphQLError): customGQLError => ({
	message: error.message,
	validationErrors: (error.extensions as customGQLExtension).exception.validationErrors?.map(
		({ property, constraints }) => ({ property, constraints })
	),
});

export const customAuthChecker: AuthChecker<customCtx, userRoles> = async (
	{ context: { req } },
	allowedRoles
) => {
	if (req.session.userId === undefined) return false;
	const user = await getRepository(User).findOne({
		where: { id: req.session.userId },
	});
	if (user === undefined) return false;
	return allowedRoles.length === 0 || allowedRoles.includes(user.role);
};
