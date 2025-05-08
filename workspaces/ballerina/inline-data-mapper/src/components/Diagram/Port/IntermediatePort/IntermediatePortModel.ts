/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { LinkModel, PortModel, PortModelGenerics } from '@projectstorm/react-diagrams';

import { DataMapperLinkModel } from '../../Link/DataMapperLink/DataMapperLink';

export interface IntermediateNodeModelGenerics {
	PORT: IntermediatePortModel;
}
export const INT_PORT_TYPE_ID = "datamapper-intermediate-port";

export class IntermediatePortModel extends PortModel<PortModelGenerics & IntermediateNodeModelGenerics> {

	constructor(
		public portId: string,
		public portType: "IN" | "OUT") {
		super({
			type: INT_PORT_TYPE_ID,
			name: portId,
		});
	}

	createLinkModel(): LinkModel {
		const lm = new DataMapperLinkModel();
		return lm;
	}

	canLinkToPort(port: IntermediatePortModel): boolean {
		return this.portType !== port.portType;
	}
}

