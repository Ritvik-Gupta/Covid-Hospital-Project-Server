import { GraphQLError } from "graphql";
import { AuthChecker } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repository";
import { UserRoles } from "./customEnums";
import { customCtx, customGQLError, customGQLExtension } from "./customTypes";

export const customFormatError = (error: GraphQLError): customGQLError => ({
	message: error.message,
	exception: {
		validationErrors: (error.extensions as customGQLExtension).exception.validationErrors?.map(
			({ property, constraints }) => ({ property, constraints })
		),
	},
});

export const customAuthChecker: AuthChecker<customCtx, UserRoles> = async (
	{ context: { req } },
	allowedRoles
) => {
	if (req.session.userId === undefined) return false;
	try {
		const user = await getCustomRepository(UserRepository).ifDefined({ id: req.session.userId });
		return allowedRoles.length === 0 || allowedRoles.includes(user.role);
	} catch (err) {
		return false;
	}
};