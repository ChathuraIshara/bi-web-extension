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
import { NodeTypes } from "../../../resources/constants";
import { PromptNodeModel } from "./PromptNodeModel";
import { PromptNodeWidget } from "./PromptNodeWidget";

export class PromptNodeFactory extends AbstractReactFactory<PromptNodeModel, DiagramEngine> {

    constructor() {
        super(NodeTypes.PROMPT_NODE);
    }

    generateModel(event: GenerateModelEvent): PromptNodeModel {
        return new PromptNodeModel(event.initialConfig);
    }

    generateReactWidget(event: GenerateWidgetEvent<PromptNodeModel>) {
        return <PromptNodeWidget engine={this.engine} model={event.model} />;
    }
}
