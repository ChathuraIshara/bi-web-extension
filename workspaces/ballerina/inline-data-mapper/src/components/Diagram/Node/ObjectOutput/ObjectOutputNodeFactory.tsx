/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-lambda  jsx-no-multiline-js
import * as React from 'react';

import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

import { InputOutputPortModel } from '../../Port';
import { OBJECT_OUTPUT_TARGET_PORT_PREFIX } from '../../utils/constants';
import { ObjectOutputWidget } from "./ObjectOutputWidget";
import { OutputSearchNoResultFound, SearchNoResultFoundKind } from "../commons/Search";

import { ObjectOutputNode, OBJECT_OUTPUT_NODE_TYPE } from './ObjectOutputNode';

export class ObjectOutputNodeFactory extends AbstractReactFactory<ObjectOutputNode, DiagramEngine> {
	constructor() {
		super(OBJECT_OUTPUT_NODE_TYPE);
	}

	generateReactWidget(event: { model: ObjectOutputNode; }): JSX.Element {
		return (
			<>
				{event.model.hasNoMatchingFields ? (
					<OutputSearchNoResultFound kind={SearchNoResultFoundKind.OutputField}/>
				) : (
					<ObjectOutputWidget
						engine={this.engine}
						id={`${OBJECT_OUTPUT_TARGET_PORT_PREFIX}.${event.model.rootName}`}
						outputType={event.model.outputType}
						typeName={event.model.typeName}
						value={undefined}
						getPort={(portId: string) => event.model.getPort(portId) as InputOutputPortModel}
						context={event.model.context}
						mappings={event.model.filterdMappings}
						valueLabel={event.model.outputType.id}
						originalTypeName={event.model.filteredOutputType?.variableName}
					/>
				)}
			</>
		);
	}

	generateModel(): ObjectOutputNode {
		return undefined;
	}
}
