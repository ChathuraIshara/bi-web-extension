/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IOType } from "@wso2-enterprise/mi-core";
import { DataMapperNodeModel } from "../commons/DataMapperNode";

export const DATA_IMPORT_NODE = "data-import-node";

export class DataImportNodeModel extends DataMapperNodeModel {
    public configName: string = 'DataMapperConfig';
    public ioType: IOType = IOType.Other;

    constructor() {
        super(undefined, undefined, DATA_IMPORT_NODE);
    }

    initLinks(): void {

    }

    initPorts(): void {

    }
}

export class InputDataImportNodeModel extends DataImportNodeModel {
    public ioType: IOType = IOType.Input;

    constructor() {
        super();
        this.id = "input-import-node";
    }
}

export class OutputDataImportNodeModel extends DataImportNodeModel {
    public ioType: IOType = IOType.Output;

    constructor() {
        super();
        this.id = "output-import-node";
    }
}
