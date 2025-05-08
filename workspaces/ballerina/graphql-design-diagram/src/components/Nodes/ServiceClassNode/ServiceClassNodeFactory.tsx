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

import { ServiceClassNodeModel, SERVICE_CLASS_NODE } from "./ServiceClassNodeModel";
import { ServiceClassNodeWidget } from "./ServiceClassWidget";

interface GenerateReactWidgetProps {
    model: ServiceClassNodeModel;
}

export class ServiceClassNodeFactory extends AbstractReactFactory<ServiceClassNodeModel, DiagramEngine> {
    constructor() {
        super(SERVICE_CLASS_NODE);
    }

    generateReactWidget(event: GenerateReactWidgetProps): JSX.Element {
        return <ServiceClassNodeWidget engine={this.engine} node={event.model}/>;
    }

    generateModel(event: { initialConfig: any }) {
        return new ServiceClassNodeModel(event.initialConfig.model);
    }
}
