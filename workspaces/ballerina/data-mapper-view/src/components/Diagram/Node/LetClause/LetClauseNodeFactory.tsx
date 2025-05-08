/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import * as React from 'react';

import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { PrimitiveBalType } from "@wso2-enterprise/ballerina-core";
import "reflect-metadata";
import { container, injectable, singleton } from "tsyringe";

import { RecordFieldPortModel } from "../../Port";
import { EXPANDED_QUERY_SOURCE_PORT_PREFIX } from '../../utils/constants';
import { IDataMapperNodeFactory } from '../commons/DataMapperNode';
import { PrimitiveTypeItemWidget } from '../commons/PrimitiveTypeItemWidget';
import { RecordTypeTreeWidget } from '../commons/RecordTypeTreeWidget/RecordTypeTreeWidget';

import {
    LetClauseNode,
    QUERY_EXPR_LET_NODE_TYPE
} from './LetClauseNode';

@injectable()
@singleton()
export class LetClauseNodeFactory extends AbstractReactFactory<LetClauseNode, DiagramEngine> implements IDataMapperNodeFactory {
    constructor() {
        super(QUERY_EXPR_LET_NODE_TYPE);
    }

    generateReactWidget(event: { model: LetClauseNode; }): JSX.Element {
        if (event.model.hasNoMatchingFields && !event.model.typeDef) {
            return;
        }
        if (event.model.typeDef.typeName === PrimitiveBalType.Record || event.model.typeDef.typeName === PrimitiveBalType.Array){
            return (
                <RecordTypeTreeWidget
                    engine={this.engine}
                    id={`${EXPANDED_QUERY_SOURCE_PORT_PREFIX}.${event.model.sourceBindingPattern.variableName.value}`}
                    typeDesc={event.model.typeDef}
                    getPort={(portId: string) => event.model.getPort(portId) as RecordFieldPortModel}
                    handleCollapse={(fieldName: string, expand?: boolean) => event.model.context.handleCollapse(fieldName, expand)}
                    valueLabel={event.model.sourceBindingPattern.variableName.value}
                    nodeHeaderSuffix='Let'
                />
            );
        }

        return (
            <PrimitiveTypeItemWidget
                engine={this.engine}
                id={`${EXPANDED_QUERY_SOURCE_PORT_PREFIX}.${event.model.sourceBindingPattern.variableName.value}`}
                typeDesc={event.model.typeDef}
                getPort={(portId: string) => event.model.getPort(portId) as RecordFieldPortModel}
                valueLabel={event.model.sourceBindingPattern.variableName.value}
                nodeHeaderSuffix='Let'
            />
        )
    }

    generateModel(): LetClauseNode {
        return undefined;
    }
}

container.register("NodeFactory", {useClass: LetClauseNodeFactory});
