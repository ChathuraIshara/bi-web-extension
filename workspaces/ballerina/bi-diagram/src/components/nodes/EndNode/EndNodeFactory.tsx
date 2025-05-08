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
import { EndNodeModel } from "./EndNodeModel";
import { EndNodeWidget } from "./EndNodeWidget";
import { NodeTypes } from "../../../resources/constants";

export class EndNodeFactory extends AbstractReactFactory<EndNodeModel, DiagramEngine> {
    constructor() {
        super(NodeTypes.END_NODE);
    }

    generateModel(event: GenerateModelEvent): EndNodeModel {
        return new EndNodeModel(event.initialConfig);
    }

    generateReactWidget(event: GenerateWidgetEvent<EndNodeModel>) {
        return <EndNodeWidget engine={this.engine} node={event.model} />;
    }
}
