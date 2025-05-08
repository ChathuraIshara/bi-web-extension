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
import { DraftNodeModel } from "./DraftNodeModel";
import { DraftNodeWidget } from "./DraftNodeWidget";
import { NodeTypes } from "../../../resources/constants";
import { NodeKind } from "../../../utils/types";

export class DraftNodeFactory extends AbstractReactFactory<DraftNodeModel, DiagramEngine> {
    constructor() {
        super(NodeTypes.DRAFT_NODE);
    }

    generateModel(event: GenerateModelEvent): DraftNodeModel {
        return new DraftNodeModel(event.initialConfig);
    }

    generateReactWidget(event: GenerateWidgetEvent<DraftNodeModel>) {
        return <DraftNodeWidget engine={this.engine} model={event.model} />;
    }
}
