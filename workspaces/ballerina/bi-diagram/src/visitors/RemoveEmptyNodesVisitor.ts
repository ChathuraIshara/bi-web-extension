/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FlowNode } from "../utils/types";
import { BaseVisitor } from "./BaseVisitor";

export class RemoveEmptyNodesVisitor implements BaseVisitor {
    private skipChildrenVisit = false;
    private node;

    constructor(node: FlowNode) {
        // console.log(">>> remove empty nodes visitor started");
        this.node = node;
    }

    beginVisitNode(node: FlowNode, parent?: FlowNode): void {
        node.branches?.forEach((branch) => {
            // if branch is not empty remove empty node
            if (branch.children && branch.children.length > 0) {
                const emptyNodeIndex = branch.children.findIndex((child) => child.codedata.node === "EMPTY");
                if (emptyNodeIndex >= 0) {
                    branch.children.splice(emptyNodeIndex, 1);
                }
                // remove start nodes from workers
                if (branch.children[0].codedata.node === "EVENT_START") {
                    branch.children.shift();
                }
            }
        });
    }

    getNode(): FlowNode {
        return this.node;
    }

    skipChildren(): boolean {
        return this.skipChildrenVisit;
    }
}
