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
import { ConnectorNodeModel } from "./ConnectorNodeModel";
import { ConnectorNodeWidget } from "./ConnectorNodeWidget";
import { NodeTypes } from "../../../resources/constants";

export class ConnectorNodeFactory extends AbstractReactFactory<ConnectorNodeModel, DiagramEngine> {
    constructor() {
        super(NodeTypes.CONNECTOR_NODE);
    }

    generateModel(event: GenerateModelEvent): ConnectorNodeModel {
        return new ConnectorNodeModel(event.initialConfig.stNode, event.initialConfig.mediatorName, event.initialConfig.documentUri);
    }

    generateReactWidget(event: GenerateWidgetEvent<ConnectorNodeModel>) {
        return <ConnectorNodeWidget engine={this.engine} node={event.model} />;
    }
}
