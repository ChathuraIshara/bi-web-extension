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
import { NodeLinkModel } from "./NodeLinkModel";
import { NodeLinkWidget } from "./NodeLinkWidget";
import { NODE_LINK } from "../../resources/constants";

export class NodeLinkFactory extends AbstractReactFactory<NodeLinkModel, DiagramEngine> {
    constructor() {
        super(NODE_LINK);
    }

    generateModel(event: GenerateModelEvent): NodeLinkModel {
        return new NodeLinkModel();
    }

    generateReactWidget(event: GenerateWidgetEvent<NodeLinkModel>): JSX.Element {
        return <NodeLinkWidget link={event.model} engine={this.engine} />;
    }
}
