/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from 'react';

import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

import { ArrayFnConnectorNode, ARRAY_FUNCTION_CONNECTOR_NODE_TYPE } from './ArrayFnConnectorNode';
import { ArrayFnConnectorNodeWidget } from './ArrayFnConnectorNodeWidget';

export class ArrayFnConnectorNodeFactory extends AbstractReactFactory<ArrayFnConnectorNode, DiagramEngine> {
	constructor() {
		super(ARRAY_FUNCTION_CONNECTOR_NODE_TYPE);
	}

	generateReactWidget(event: { model: ArrayFnConnectorNode; }): JSX.Element {
		const inputPortHasLinks = Object.keys(event.model.inPort.links).length;
		const outputPortHasLinks = Object.keys(event.model.outPort.links).length;
		if (inputPortHasLinks && outputPortHasLinks) {
			return <ArrayFnConnectorNodeWidget engine={this.engine} node={event.model} />;
		}
		return null;
	}

	generateModel(): ArrayFnConnectorNode {
		return undefined;
	}
}
