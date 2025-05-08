/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    NodePosition,
    STNode,
    Visitor,
} from "@wso2-enterprise/syntax-tree";

import { isPositionsEquals } from "../../../utils/st-utils";

export class NodeFindingVisitorByPosition implements Visitor {
    private foundNode: STNode;
    private parentNode: STNode;

    constructor(private position: NodePosition) {}

    public beginVisitSTNode(node: STNode, parent?: STNode): void {
        if (!this.foundNode) {
            if (isPositionsEquals(node.position, this.position)) {
                this.foundNode = node;
                this.parentNode = parent;
            }
        }
    }

    public getNode() {
        return this.foundNode;
    }

    public getParentNode() {
        return this.parentNode;
    }
}
