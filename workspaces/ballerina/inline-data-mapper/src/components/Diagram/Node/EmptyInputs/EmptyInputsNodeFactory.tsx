/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import * as React from 'react';

import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

import { EmptyInputsNode, EMPTY_INPUTS_NODE_TYPE } from './EmptyInputsNode';
import { EmptyInputsWidget } from "./EmptyInputsNodeWidget";

export class EmptyInputsNodeFactory extends AbstractReactFactory<EmptyInputsNode, DiagramEngine> {
	constructor() {
		super(EMPTY_INPUTS_NODE_TYPE);
	}

	generateReactWidget(event: { model: EmptyInputsNode; }): JSX.Element {
		return <EmptyInputsWidget />;
	}

	generateModel(): EmptyInputsNode {
		return undefined;
	}
}
