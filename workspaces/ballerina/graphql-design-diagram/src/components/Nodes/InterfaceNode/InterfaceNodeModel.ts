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
import { InterfaceComponent } from "../../resources/model";
import { GraphqlDesignNode } from "../BaseNode/GraphqlDesignNode";

export const INTERFACE_NODE = "interfaceNode";

export class InterfaceNodeModel extends GraphqlDesignNode {
    readonly interfaceObject: InterfaceComponent;


    constructor(interfaceObject: InterfaceComponent) {
        super(INTERFACE_NODE, interfaceObject.name);
        this.interfaceObject = interfaceObject;

        this.addPort(new GraphqlNodeBasePort(this.interfaceObject.name, PortModelAlignment.LEFT));
        this.addPort(new GraphqlNodeBasePort(this.interfaceObject.name, PortModelAlignment.RIGHT));
        this.addPort(new GraphqlNodeBasePort(this.interfaceObject.name, PortModelAlignment.TOP));

        this.interfaceObject.resourceFunctions?.forEach(resourceFunction => {
            this.addPort(new GraphqlNodeBasePort(resourceFunction.identifier, PortModelAlignment.LEFT));
            this.addPort(new GraphqlNodeBasePort(resourceFunction.identifier, PortModelAlignment.RIGHT));
        });

        this.interfaceObject.possibleTypes.forEach(possibleType => {
            this.addPort(new GraphqlNodeBasePort(possibleType.componentName, PortModelAlignment.LEFT));
            this.addPort(new GraphqlNodeBasePort(possibleType.componentName, PortModelAlignment.RIGHT));
        });
    }
}
