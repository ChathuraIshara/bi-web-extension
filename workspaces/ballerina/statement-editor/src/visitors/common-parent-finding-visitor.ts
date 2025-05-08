/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    NodePosition,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";

import { isNodeInRange } from "../utils";

class CommonParentFindingVisitor implements Visitor {
    private firstNodePosition: NodePosition;
    private secondNodePosition: NodePosition;
    private model: STNode;

    public beginVisitSTNode(node: STNode, parent?: STNode) {
        if (isNodeInRange(this.firstNodePosition, node.position) && isNodeInRange(this.secondNodePosition, node.position)) {
            this.model = node;
        }
    }

    getModel(): STNode {
        const newModel = this.model;
        this.model = undefined;
        return newModel;
    }

    setPositions(firstNodeposition: NodePosition, secondNodePosition: NodePosition) {
        this.firstNodePosition = firstNodeposition;
        this.secondNodePosition = secondNodePosition
    }
}

export const visitor = new CommonParentFindingVisitor();
