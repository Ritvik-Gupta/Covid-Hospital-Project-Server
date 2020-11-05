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

const normalizeInfo = (info: GraphQLResolveInfo): normalizeFieldObject =>
	info.fieldNodes.reduce((coll, cur) => ({ ...coll, ...normalizeField(cur) }), {});

type path = [string, string];

interface fieldPathsReduced {
	parents: string[];
	joins: path[];
}

const reduceFieldPath = (fieldObject: normalizeFieldObject): fieldPathsReduced =>
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

export interface normalizedFieldPaths {
	parent: string;
	joins: path[];
}

export const getFieldPaths = (
	fieldObject: normalizeFieldObject
): normalizedFieldPaths => {
	const { parents, joins } = reduceFieldPath(fieldObject);
	return { parent: parents[0], joins };
};

export const FieldObject = (): ParameterDecorator =>
	createParamDecorator(({ info }) => normalizeInfo(info));

export const FieldPath = (): ParameterDecorator =>
	createParamDecorator(({ info }) => getFieldPaths(normalizeInfo(info)));
