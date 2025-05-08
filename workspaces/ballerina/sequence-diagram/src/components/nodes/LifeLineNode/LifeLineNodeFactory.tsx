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
import { LifeLineNodeModel } from "./LifeLineNodeModel";
import { LifeLineNodeWidget } from "./LifeLineNodeWidget";
import { NodeTypes } from "../../../resources/constants";

export class LifeLineNodeFactory extends AbstractReactFactory<LifeLineNodeModel, DiagramEngine> {
    constructor() {
        super(NodeTypes.LIFE_LINE_NODE);
    }

    generateModel(event: GenerateModelEvent): LifeLineNodeModel {
        return new LifeLineNodeModel(event.initialConfig);
    }

    generateReactWidget(event: GenerateWidgetEvent<LifeLineNodeModel>) {
        return <LifeLineNodeWidget engine={this.engine} node={event.model} />;
    }
}
