/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Flow, FlowNode } from "../utils/types";
import { BaseVisitor } from "./BaseVisitor";

export class RemoveNodeVisitor implements BaseVisitor {
    private skipChildrenVisit = false;
    private flow: Flow;
    private nodeId: string;

    constructor(originalFlowModel: Flow, nodeId: string) {
        // console.log(">>> remove node visitor started", { nodeId });
        this.flow = originalFlowModel;
        this.nodeId = nodeId;
    }

    beginVisitEventStart(node: FlowNode, parent?: FlowNode): void {
        this.flow.nodes.forEach((flowNode) => {
            if (flowNode.id === this.nodeId) {
                console.log(">>> http-api remove node", { target: flowNode });
                const index = this.flow.nodes.indexOf(flowNode);
                this.flow.nodes.splice(index, 1);
                this.skipChildrenVisit = true;
            }
        });
    }

    beginVisitErrorHandler(node: FlowNode, parent?: FlowNode): void {
        if (this.skipChildrenVisit) {
            return;
        }

        node.branches.forEach((branch) => {
            branch.children.forEach((child) => {
                if (child.id === this.nodeId) {
                    console.log(">>> do-error remove node", { target: child });
                    const index = branch.children.indexOf(child);
                    branch.children.splice(index, 1);
                    this.skipChildrenVisit = true;
                }
            });
        });
    }

    beginVisitIf(node: FlowNode, parent?: FlowNode): void {
        if (this.skipChildrenVisit) {
            return;
        }

        node.branches.forEach((branch) => {
            branch.children.forEach((child) => {
                if (child.id === this.nodeId) {
                    const index = branch.children.indexOf(child);
                    branch.children.splice(index, 1);
                    this.skipChildrenVisit = true;
                }
            });
        });
    }

    skipChildren(): boolean {
        return this.skipChildrenVisit;
    }

    getUpdatedFlow(): Flow {
        return this.flow;
    }
}
