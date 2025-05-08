/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { PortModelAlignment } from "@projectstorm/react-diagrams";

import { GraphqlNodeBasePort } from "../../Port/GraphqlNodeBasePort";
import { RecordComponent } from "../../resources/model";
import { GraphqlDesignNode } from "../BaseNode/GraphqlDesignNode";

export const RECORD_NODE = "recordNode";

export class RecordNodeModel extends GraphqlDesignNode {
    readonly recordObject: RecordComponent;


    constructor(recordObject: RecordComponent) {
        super(RECORD_NODE, recordObject.name);
        this.recordObject = recordObject;

        this.addPort(new GraphqlNodeBasePort(this.recordObject.name, PortModelAlignment.LEFT));
        this.addPort(new GraphqlNodeBasePort(this.recordObject.name, PortModelAlignment.RIGHT));
        this.addPort(new GraphqlNodeBasePort(this.recordObject.name, PortModelAlignment.TOP));

        this.recordObject.recordFields.forEach(field => {
            this.addPort(new GraphqlNodeBasePort(field.name, PortModelAlignment.LEFT));
            this.addPort(new GraphqlNodeBasePort(field.name, PortModelAlignment.RIGHT));
        });
    }
}
