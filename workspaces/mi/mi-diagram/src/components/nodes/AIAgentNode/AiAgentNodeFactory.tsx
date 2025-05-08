/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { AbstractReactFactory, GenerateModelEvent, GenerateWidgetEvent } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { AiAgentNodeModel } from "./AiAgentNodeModel";
import { AiAgentNodeWidget } from "./AiAgentNodeWidget";
import { NodeTypes } from "../../../resources/constants";

export class AiAgentNodeFactory extends AbstractReactFactory<AiAgentNodeModel, DiagramEngine> {
    constructor() {
        super(NodeTypes.AI_AGENT_NODE);
    }

    generateModel(event: GenerateModelEvent): AiAgentNodeModel {
        return new AiAgentNodeModel(
            event.initialConfig.stNode,
            event.initialConfig.mediatorName,
            event.initialConfig.documentUri
        );
    }

    generateReactWidget(event: GenerateWidgetEvent<AiAgentNodeModel>) {
        return <AiAgentNodeWidget engine={this.engine} node={event.model} />;
    }
}
