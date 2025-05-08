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
import { EnumComponent } from "../../resources/model";
import { GraphqlDesignNode } from "../BaseNode/GraphqlDesignNode";

export const ENUM_NODE = "enumNode";

export class EnumNodeModel extends GraphqlDesignNode {
    readonly enumObject: EnumComponent;

    constructor(enumObject: EnumComponent) {
        super(ENUM_NODE, enumObject.name);
        this.enumObject = enumObject;

        this.addPort(new GraphqlNodeBasePort(this.enumObject.name, PortModelAlignment.LEFT));
        this.addPort(new GraphqlNodeBasePort(this.enumObject.name, PortModelAlignment.RIGHT));
        this.addPort(new GraphqlNodeBasePort(this.enumObject.name, PortModelAlignment.TOP));

        // no ports added for enum fields as the type of the enum fields will be primitive types without links
    }
}
