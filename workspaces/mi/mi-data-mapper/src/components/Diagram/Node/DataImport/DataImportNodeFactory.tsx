/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';

import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DataImportNodeModel } from "./DataImportNode";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { DATA_IMPORT_NODE } from "./DataImportNode";
import { DataImportNodeWidget } from "./DataImportNodeWidget";

export class DataImportNodeFactory extends AbstractReactFactory<DataImportNodeModel, DiagramEngine> {
    constructor() {
        super(DATA_IMPORT_NODE);
    }

    generateReactWidget(event: { model: DataImportNodeModel; }): JSX.Element {
        return (
            <DataImportNodeWidget configName={event.model.configName} ioType={event.model.ioType}/>
        );
    }

    generateModel(): DataImportNodeModel {
        return new DataImportNodeModel();
    }
}
