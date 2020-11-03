import { FieldNode, GraphQLResolveInfo } from "graphql";
import { createParamDecorator } from "type-graphql";

export interface normalizeFieldObject {
	[key: string]: true | normalizeFieldObject;
}

const normalizeField = (node: FieldNode): normalizeFieldObject => ({
	[node.name.value]:
		node.selectionSet === undefined
			? true
			: node.selectionSet.selections.reduce(
					(coll, sel) => ({ ...coll, ...normalizeField(sel as FieldNode) }),
					{}
			  ),
});

export const normalizeInfo = (info: GraphQLResolveInfo): normalizeFieldObject =>
	info.fieldNodes.reduce((coll, cur) => ({ ...coll, ...normalizeField(cur) }), {});

export const FieldObject = (): ParameterDecorator =>
	createParamDecorator(({ info }) => normalizeInfo(info));

type path = [string, string];

interface fieldPathsReduced {
	parents: string[];
	joins: path[];
}

export interface fieldPaths {
	parent: string;
	joins: path[];
}

export const reduceFieldPath = (
	fieldObject: normalizeFieldObject
): fieldPathsReduced =>
	Object.entries(fieldObject).reduce<fieldPathsReduced>(
		(coll, [key, value]) => {
			if (value === true) return coll;
			const { parents, joins } = reduceFieldPath(value);
			return {
				parents: [...coll.parents, key],
				joins: [
					...coll.joins,
					...parents.map<path>(parent => [key, parent]),
					...joins,
				],
			};
		},
		{ parents: [], joins: [] }
	);

export const getFieldPaths = (fieldObject: normalizeFieldObject): fieldPaths => {
	const { parents, joins } = reduceFieldPath(fieldObject);
	return { parent: parents[0], joins };
};
