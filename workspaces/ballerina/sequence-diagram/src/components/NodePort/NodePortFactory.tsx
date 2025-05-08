/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { AbstractReactFactory, GenerateModelEvent, GenerateWidgetEvent } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { NodePortModel } from "./NodePortModel";
import { NodePortWidget } from "./NodePortWidget";
import { NODE_PORT } from "../../resources/constants";

export class NodePortFactory extends AbstractReactFactory<NodePortModel, DiagramEngine> {
    constructor() {
        super(NODE_PORT);
    }

    generateModel(event: GenerateModelEvent): NodePortModel {
        return new NodePortModel(event.initialConfig);
    }

    generateReactWidget(event: GenerateWidgetEvent<NodePortModel>): JSX.Element {
        return <NodePortWidget engine={this.engine} port={event.model} />;
    }
}
