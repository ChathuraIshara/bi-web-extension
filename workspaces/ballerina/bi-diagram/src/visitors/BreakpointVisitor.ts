/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FlowNode, CurrentBreakpointsResponse as BreakpointInfo } from "@wso2-enterprise/ballerina-core";
import { BaseVisitor } from "./BaseVisitor";


export class BreakpointVisitor implements BaseVisitor {
    private breakpointInfo: BreakpointInfo;
    private skipChildrenVisit = false;

    constructor(breakpoints: BreakpointInfo) {
        this.breakpointInfo = breakpoints;
    }

    private setBreakpointData(node: FlowNode) {
        if (this.breakpointInfo.breakpoints && this.breakpointInfo.breakpoints.length > 0) {
            for (const breakpoint of this.breakpointInfo.breakpoints) {
                if (
                    breakpoint.line === node.codedata?.lineRange?.startLine?.line &&
                    (!breakpoint.column || breakpoint.column === node.codedata?.lineRange?.startLine?.offset)) {
                    node.hasBreakpoint = true;
                    break;
                }
            }

            
        }

        if (this.breakpointInfo?.activeBreakpoint &&
            this.breakpointInfo.activeBreakpoint.line === node.codedata?.lineRange?.startLine?.line &&
            (!this.breakpointInfo.activeBreakpoint.column ||
                this.breakpointInfo.activeBreakpoint.column === node.codedata?.lineRange?.startLine?.offset)) {
            node.isActiveBreakpoint = true;
        }
    }

    skipChildren(): boolean {
        return this.skipChildrenVisit;
    }

    beginVisitNode?(node: FlowNode, parent?: FlowNode): void {
        this.setBreakpointData(node);
    }

    beginVisitIf?(node: FlowNode, parent?: FlowNode): void {
        this.setBreakpointData(node);
    }

    beginVisitWhile?(node: FlowNode, parent?: FlowNode): void {
        this.setBreakpointData(node);
    }

    beginVisitForeach?(node: FlowNode, parent?: FlowNode): void {
        this.setBreakpointData(node);
    }

    beginVisitErrorHandler(node: FlowNode, parent?: FlowNode): void {
        this.setBreakpointData(node);
    }

    beginVisitRemoteActionCall?(node: FlowNode, parent?: FlowNode): void {
        this.setBreakpointData(node);
    }

    beginVisitResourceActionCall?(node: FlowNode, parent?: FlowNode): void {
        this.setBreakpointData(node);
    }

    beginVisitReturn?(node: FlowNode, parent?: FlowNode): void {
        this.setBreakpointData(node);
    }
}
