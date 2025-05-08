/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { TypeKind } from '@wso2-enterprise/ballerina-core';

import { InputOutputPortModel } from '../../Port';
import { InputNodeWidget } from "./InputNodeWidget";
import { InputSearchNoResultFound, SearchNoResultFoundKind } from "../commons/Search";

import { InputNode, INPUT_NODE_TYPE } from './InputNode';
import { PrimitiveTypeInputWidget } from '../commons/PrimitiveTypeInputWidget';

export class InputNodeFactory extends AbstractReactFactory<InputNode, DiagramEngine> {
    constructor() {
        super(INPUT_NODE_TYPE);
    }

    generateReactWidget(event: { model: InputNode; }): JSX.Element {
        if (!event.model.inputType) {
            return (
                <InputSearchNoResultFound kind={SearchNoResultFoundKind.InputField} />
            );
        } else if (event.model.inputType && event.model.inputType.kind === TypeKind.Record) {
            return (
                <InputNodeWidget
                    engine={this.engine}
                    id={event.model.inputType?.id}
                    dmType={event.model.inputType}
                    getPort={(portId: string) => event.model.getPort(portId) as InputOutputPortModel}
                />
            );
        }
        return (
            <PrimitiveTypeInputWidget
                engine={this.engine}
                id={event.model.inputType?.id}
                dmType={event.model.inputType}
                getPort={(portId: string) => event.model.getPort(portId) as InputOutputPortModel}
                valueLabel={event.model.inputType?.variableName}
            />
        )
    }

    generateModel(): InputNode {
        return undefined;
    }
}
