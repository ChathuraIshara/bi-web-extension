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
import { NodeKind } from "../../../utils/types";
import { ErrorNodeModel } from "./ErrorNodeModel";
import { ErrorNodeWidget } from "./ErrorNodeWidget";

export class ErrorNodeFactory extends AbstractReactFactory<ErrorNodeModel, DiagramEngine> {
    constructor() {
        super(NodeTypes.ERROR_NODE);
    }

    generateModel(event: GenerateModelEvent): ErrorNodeModel {
        return new ErrorNodeModel(event.initialConfig, event.initialConfig.branch);
    }

    generateReactWidget(event: GenerateWidgetEvent<ErrorNodeModel>) {
        switch (event.model.node.codedata.node as NodeKind) {
            default:
                return (
                    <ErrorNodeWidget engine={this.engine} model={event.model} />
                );
        }
    }
}
