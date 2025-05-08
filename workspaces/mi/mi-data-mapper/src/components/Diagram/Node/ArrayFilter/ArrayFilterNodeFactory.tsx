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

import { ArrayFilterNode, ARRAY_FILTER_NODE_TYPE } from './ArrayFilterNode';
import { ArrayFilterNodeWidget } from "./ArrayFilterNodeWidget";

export class ArrayFilterNodeFactory extends AbstractReactFactory<ArrayFilterNode, DiagramEngine> {
    constructor() {
        super(ARRAY_FILTER_NODE_TYPE);
    }

    generateReactWidget(event: { model: ArrayFilterNode; }): JSX.Element {
        return (
            <ArrayFilterNodeWidget
                filterExpressions={event.model.filterExpressions}
                focusedInputCallExpr={event.model.focusedInputNode.value}
                context={event.model.context}
                label={event.model.focusedInputNode.nodeLabel}
                engine={this.engine}
                port={event.model.getPort(ARRAY_FILTER_NODE_TYPE)}
            />
        );
    }

    generateModel(): ArrayFilterNode {
        return undefined;
    }
}
