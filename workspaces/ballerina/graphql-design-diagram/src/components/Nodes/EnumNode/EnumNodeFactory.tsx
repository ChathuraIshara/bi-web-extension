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

import { EnumNodeModel, ENUM_NODE } from "./EnumNodeModel";
import { EnumNodeWidget } from "./EnumNodeWidget";

interface GenerateReactWidgetProps {
    model: EnumNodeModel;
}

export class EnumNodeFactory extends AbstractReactFactory<EnumNodeModel, DiagramEngine> {
    constructor() {
        super(ENUM_NODE);
    }

    generateReactWidget(event: GenerateReactWidgetProps): JSX.Element {
        return <EnumNodeWidget engine={this.engine} node={event.model}/>;
    }

    generateModel(event: { initialConfig: any }) {
        return new EnumNodeModel(event.initialConfig.model);
    }
}
