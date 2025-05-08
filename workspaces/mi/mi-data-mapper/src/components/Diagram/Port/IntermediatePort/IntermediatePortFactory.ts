/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams';

import { INT_PORT_TYPE_ID } from './IntermediatePortModel';

export class IntermediatePortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {

	constructor() {
		super(INT_PORT_TYPE_ID);
	}

	generateModel(): PortModel {
		return undefined;
	}
}
