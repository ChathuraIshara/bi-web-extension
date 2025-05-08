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
import { StartNodeModel } from "./StartNodeModel";
import { StartNodeWidget } from "./StartNodeWidget";
import { NodeTypes } from "../../../resources/constants";

export class StartNodeFactory extends AbstractReactFactory<StartNodeModel, DiagramEngine> {
    constructor() {
        super(NodeTypes.START_NODE);
    }

    generateModel(event: GenerateModelEvent): StartNodeModel {
        return new StartNodeModel(event.initialConfig.stNode, event.initialConfig.startNodeType, event.initialConfig.documentUri);
    }

    generateReactWidget(event: GenerateWidgetEvent<StartNodeModel>) {
        return <StartNodeWidget engine={this.engine} node={event.model} />;
    }
}
