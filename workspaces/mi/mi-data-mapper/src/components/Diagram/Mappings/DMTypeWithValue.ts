/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { DMType } from "@wso2-enterprise/mi-core";
import { Node } from "ts-morph";

export interface ArrayElement {
	member: DMTypeWithValue;
	elementNode: Node;
}

export class DMTypeWithValue {
	constructor(
		public type: DMType,
		public value?: Node,
		public parentType?: DMTypeWithValue,
		public originalType?: DMType,
		public childrenTypes?: DMTypeWithValue[],
		public elements?: ArrayElement[]
	){}

	public hasValue() {
		return !!this.value;
	}

	public setValue(value: Node) {
		this.value = value;
	}
}
