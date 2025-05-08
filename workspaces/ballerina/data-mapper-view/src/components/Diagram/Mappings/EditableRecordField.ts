/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TypeField } from "@wso2-enterprise/ballerina-core";
import { STNode } from "@wso2-enterprise/syntax-tree";

export interface ArrayElement {
	member: EditableRecordField;
	elementNode: STNode;
}

export class EditableRecordField {
	constructor(
		public type: TypeField,
		public value?: STNode,
		public parentType?: EditableRecordField,
		public originalType?: TypeField,
		public childrenTypes?: EditableRecordField[],
		public elements?: ArrayElement[]
	){}

	public hasValue() {
		return !!this.value;
	}
}
