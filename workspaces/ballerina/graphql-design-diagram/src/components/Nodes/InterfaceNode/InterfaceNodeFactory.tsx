/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: no-implicit-dependencies
import React from "react";

import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";

import { InterfaceNodeModel, INTERFACE_NODE } from "./InterfaceNodeModel";
import { InterfaceNodeWidget } from "./InterfaceNodeWidget";

interface GenerateReactWidgetProps {
    model: InterfaceNodeModel;
}

export class InterfaceNodeFactory extends AbstractReactFactory<InterfaceNodeModel, DiagramEngine> {
    constructor() {
        super(INTERFACE_NODE);
    }

    generateReactWidget(event: GenerateReactWidgetProps): JSX.Element {
        return <InterfaceNodeWidget engine={this.engine} node={event.model}/>;
    }

    generateModel(event: { initialConfig: any }) {
        return new InterfaceNodeModel(event.initialConfig.model);
    }
}
