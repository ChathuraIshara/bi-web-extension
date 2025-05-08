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
import { HierarchicalResourceComponent } from "../../resources/model";
import { GraphqlDesignNode } from "../BaseNode/GraphqlDesignNode";

export const HIERARCHICAL_NODE = "hierarchicalNode";

export class HierarchicalNodeModel extends GraphqlDesignNode {
    readonly resourceObject: HierarchicalResourceComponent;


    constructor(resourceObj: HierarchicalResourceComponent) {
        super(HIERARCHICAL_NODE, resourceObj.name);
        this.resourceObject = resourceObj;

        this.addPort(new GraphqlNodeBasePort(this.resourceObject.name, PortModelAlignment.LEFT));
        this.addPort(new GraphqlNodeBasePort(this.resourceObject.name, PortModelAlignment.RIGHT));
        this.addPort(new GraphqlNodeBasePort(this.resourceObject.name, PortModelAlignment.TOP));

        this.resourceObject.hierarchicalResources?.forEach(resource => {
            this.addPort(new GraphqlNodeBasePort(resource.identifier, PortModelAlignment.LEFT));
            this.addPort(new GraphqlNodeBasePort(resource.identifier, PortModelAlignment.RIGHT));
        });
    }
}
