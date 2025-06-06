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
import { Node } from 'ts-morph';

import { InputOutputPortModel } from '../../Port';
import { ARRAY_OUTPUT_TARGET_PORT_PREFIX } from '../../utils/constants';
import { ArrayOutputWidget } from "./ArrayOutputWidget";
import { OutputSearchNoResultFound, SearchNoResultFoundKind } from "../commons/Search";

import { ArrayOutputNode, ARRAY_OUTPUT_NODE_TYPE } from './ArrayOutputNode';

export class ArrayOutputNodeFactory extends AbstractReactFactory<ArrayOutputNode, DiagramEngine> {
	constructor() {
		super(ARRAY_OUTPUT_NODE_TYPE);
	}

	generateReactWidget(event: { model: ArrayOutputNode; }): JSX.Element {
		let valueLabel: string;
		const { isMapFn, isSubMapping, context } = event.model;
		const { views, focusedST } = context;
		const isMapFnAtFnReturn = views.length === 1 && Node.isFunctionDeclaration(focusedST);
		if ((isMapFn && !isMapFnAtFnReturn) || isSubMapping) {
			valueLabel = views[views.length - 1].label.replace(/\[\]/g, '');
		}
		return (
			<>
				{event.model.hasNoMatchingFields ? (
					<OutputSearchNoResultFound kind={SearchNoResultFoundKind.OutputField} />
				) : (
					<ArrayOutputWidget
						engine={this.engine}
						id={`${ARRAY_OUTPUT_TARGET_PORT_PREFIX}${event.model.rootName ? `.${event.model.rootName}` : ''}`}
						dmTypeWithValue={event.model.dmTypeWithValue}
						typeName={event.model.typeName}
						getPort={(portId: string) => event.model.getPort(portId) as InputOutputPortModel}
						context={event.model.context}
						valueLabel={valueLabel}
						deleteField={(node: Node) => event.model.deleteField(node)}
					/>
				)}
			</>
		);
	}

	generateModel(event: { initialConfig: any }): any {
		return undefined;
	}
}
