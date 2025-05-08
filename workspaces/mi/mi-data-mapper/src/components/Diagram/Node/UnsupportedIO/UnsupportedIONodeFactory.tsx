/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { UnsupportedIONode, UNSUPPORTED_IO_NODE_TYPE } from './UnsupportedIONode';
import { UnsupportedExpr, UnsupportedIO } from "./UnsupportedIONodeWidget";

export class UnsupportedIONodeFactory extends AbstractReactFactory<UnsupportedIONode, DiagramEngine> {
	constructor() {
		super(UNSUPPORTED_IO_NODE_TYPE);
	}

	generateReactWidget(event: { model: UnsupportedIONode; }): JSX.Element {
		return (
			<>
				{event.model.message ? (
					<UnsupportedIO
						message={event.model.message}
					/>
				) : (
					<UnsupportedExpr
						unsupportedExpr={event.model.unsupportedExpr}
						context={event.model.context}
					/>
				)}
			</>
		);
	}

	generateModel(): UnsupportedIONode {
		return undefined;
	}
}
