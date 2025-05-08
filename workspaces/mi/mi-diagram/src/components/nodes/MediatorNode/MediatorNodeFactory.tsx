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
import { MediatorNodeModel } from "./MediatorNodeModel";
import { MediatorNodeWidget } from "./MediatorNodeWidget";
import { NodeTypes } from "../../../resources/constants";

export class MediatorNodeFactory extends AbstractReactFactory<MediatorNodeModel, DiagramEngine> {
    constructor(nodeType: string = NodeTypes.MEDIATOR_NODE) {
        super(nodeType);
    }

    generateModel(event: GenerateModelEvent): MediatorNodeModel {
        return new MediatorNodeModel(NodeTypes.MEDIATOR_NODE, event.initialConfig.stNode, event.initialConfig.mediatorName, event.initialConfig.documentUri);
    }

    generateReactWidget(event: GenerateWidgetEvent<MediatorNodeModel>) {
        return <MediatorNodeWidget
            engine={this.engine}
            node={event.model}
        />;
    }
}
