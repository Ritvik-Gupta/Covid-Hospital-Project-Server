import { FieldNode, GraphQLResolveInfo } from "graphql";

export interface normalizeField {
	[key: string]: true | normalizeField;
}

const normalizeField = (node: FieldNode): normalizeField => ({
	[node.name.value]:
		node.selectionSet === undefined
			? true
			: node.selectionSet.selections.reduce(
					(coll, sel) => ({ ...coll, ...normalizeField(sel as FieldNode) }),
					{}
			  ),
});

export const normalizeInfo = (info: GraphQLResolveInfo): normalizeField =>
	info.fieldNodes.reduce((coll, cur) => ({ ...coll, ...normalizeField(cur) }), {});
