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

import { InputOutputPortModel } from "../../Port";
import { FOCUSED_INPUT_SOURCE_PORT_PREFIX } from '../../utils/constants';
import { FocusedInputNode, FOCUSED_INPUT_NODE_TYPE } from './FocusedInputNode';
import { InputSearchNoResultFound, SearchNoResultFoundKind } from '../commons/Search';
import { InputNodeWidget } from '../Input/InputNodeWidget';

export class FocusedInputNodeFactory extends AbstractReactFactory<FocusedInputNode, DiagramEngine> {
    constructor() {
        super(FOCUSED_INPUT_NODE_TYPE);
    }

    generateReactWidget(event: { model: FocusedInputNode; }): JSX.Element {
        if (event.model.hasNoMatchingFields) {
            return (
                <InputSearchNoResultFound kind={SearchNoResultFoundKind.InputField} />
            );
        }
        return (
            <InputNodeWidget
                engine={this.engine}
                id={`${FOCUSED_INPUT_SOURCE_PORT_PREFIX}.${event.model.nodeLabel}`}
                dmType={event.model.dmType}
                getPort={(portId: string) => event.model.getPort(portId) as InputOutputPortModel}
                context={event.model.context}
                valueLabel={event.model.nodeLabel}
            />
        );
    }

    generateModel(): FocusedInputNode {
        return undefined;
    }
}
