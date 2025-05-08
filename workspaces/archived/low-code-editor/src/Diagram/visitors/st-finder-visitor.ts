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
    STKindChecker,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";


export class STFindingVisitor implements Visitor {
    private position: NodePosition;
    private stNode: STNode;

    public beginVisitSTNode(node: STNode, parent?: STNode) {
        if (!this.stNode && !STKindChecker.isModulePart(node)) {
            const isPositionsEquals = node.position?.startLine === this.position?.startLine &&
                node.position?.startColumn === this.position?.startColumn &&
                node.position?.endLine === this.position?.endLine &&
                node.position?.endColumn === this.position?.endColumn
            if (isPositionsEquals) {
                this.stNode = node;
            }
        }
    }

    getSTNode(): STNode {
        const newModel = this.stNode;
        this.stNode = undefined;
        return newModel;
    }

    setPosition(position: NodePosition) {
        this.position = position;
    }
}

export const visitor = new STFindingVisitor();
