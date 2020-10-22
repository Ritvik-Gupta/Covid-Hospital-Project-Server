import { FieldNode, GraphQLResolveInfo } from "graphql";

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
