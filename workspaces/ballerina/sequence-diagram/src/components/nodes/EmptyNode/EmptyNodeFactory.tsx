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
import { EmptyNodeModel } from "./EmptyNodeModel";
import { EmptyNodeWidget } from "./EmptyNodeWidget";
import { NodeTypes } from "../../../resources/constants";

export class EmptyNodeFactory extends AbstractReactFactory<EmptyNodeModel, DiagramEngine> {
    constructor() {
        super(NodeTypes.EMPTY_NODE);
    }

    generateModel(event: GenerateModelEvent): EmptyNodeModel {
        return new EmptyNodeModel(event.initialConfig);
    }

    generateReactWidget(event: GenerateWidgetEvent<EmptyNodeModel>) {
        return <EmptyNodeWidget engine={this.engine} node={event.model} />;
    }
}
