import { FieldNode, GraphQLResolveInfo } from "graphql";
import { createParamDecorator } from "type-graphql";

export interface normalizeFieldObject {
	[key: string]: true | normalizeFieldObject;
}

export type normalizeFieldType = (node: FieldNode) => normalizeFieldObject;

export const normalizeField: normalizeFieldType = node => ({
	[node.name.value]:
		node.selectionSet === undefined
			? true
			: node.selectionSet.selections.reduce(
					(coll, sel) => ({ ...coll, ...normalizeField(sel as FieldNode) }),
					{}
			  ),
});

export type normalizeInfoType = (info: GraphQLResolveInfo) => normalizeFieldObject;

export const normalizeInfo: normalizeInfoType = info =>
	info.fieldNodes.reduce((coll, cur) => ({ ...coll, ...normalizeField(cur) }), {});

export const FieldObject = (): ParameterDecorator =>
	createParamDecorator(({ info }) => normalizeInfo(info));

export type path = [string, string];

export interface fieldPaths {
	parents: string[];
	joins: path[];
}

export const getFieldPaths = (fieldObject: normalizeFieldObject): fieldPaths =>
	Object.entries(fieldObject).reduce<fieldPaths>(
		(coll, [key, value]) => {
			if (value === true) return coll;
			const { parents, joins } = getFieldPaths(value);
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
