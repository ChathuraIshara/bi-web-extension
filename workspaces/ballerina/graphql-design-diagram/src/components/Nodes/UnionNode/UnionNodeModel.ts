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
import { UnionComponent } from "../../resources/model";
import { GraphqlDesignNode } from "../BaseNode/GraphqlDesignNode";

export const UNION_NODE = "unionNode";

export class UnionNodeModel extends GraphqlDesignNode {
    readonly unionObject: UnionComponent;

    constructor(unionObject: UnionComponent) {
        super(UNION_NODE, unionObject.name);
        this.unionObject = unionObject;

        this.addPort(new GraphqlNodeBasePort(this.unionObject.name, PortModelAlignment.LEFT));
        this.addPort(new GraphqlNodeBasePort(this.unionObject.name, PortModelAlignment.RIGHT));
        this.addPort(new GraphqlNodeBasePort(this.unionObject.name, PortModelAlignment.TOP));

        this.unionObject.possibleTypes?.forEach(possibleType => {
            this.addPort(new GraphqlNodeBasePort(possibleType.componentName, PortModelAlignment.LEFT));
            this.addPort(new GraphqlNodeBasePort(possibleType.componentName, PortModelAlignment.RIGHT));
        });
    }
}
