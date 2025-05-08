/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Branch, FlowNode } from "../utils/types";

export interface BaseVisitor {
    skipChildren(): boolean;

    beginVisitNode?(node: FlowNode, parent?: FlowNode): void;
    endVisitNode?(node: FlowNode, parent?: FlowNode): void;

    beginVisitEventStart?(node: FlowNode, parent?: FlowNode): void;
    endVisitEventStart?(node: FlowNode, parent?: FlowNode): void;

    beginVisitErrorHandler?(node: FlowNode, parent?: FlowNode): void;
    endVisitErrorHandler?(node: FlowNode, parent?: FlowNode): void;

    beginVisitIf?(node: FlowNode, parent?: FlowNode): void;
    endVisitIf?(node: FlowNode, parent?: FlowNode): void;

    beginVisitConditional?(node: Branch, parent?: FlowNode): void;
    endVisitConditional?(node: Branch, parent?: FlowNode): void;

    beginVisitBody?(node: Branch, parent?: FlowNode): void;
    endVisitBody?(node: Branch, parent?: FlowNode): void;

    beginVisitElse?(node: Branch, parent?: FlowNode): void;
    endVisitElse?(node: Branch, parent?: FlowNode): void;

    beginVisitWhile?(node: FlowNode, parent?: FlowNode): void;
    endVisitWhile?(node: FlowNode, parent?: FlowNode): void;

    beginVisitForeach?(node: FlowNode, parent?: FlowNode): void;
    endVisitForeach?(node: FlowNode, parent?: FlowNode): void;
    
    beginVisitBlock?(node: Branch, parent?: FlowNode): void;
    endVisitBlock?(node: Branch, parent?: FlowNode): void;

    beginVisitRemoteActionCall?(node: FlowNode, parent?: FlowNode): void;
    endVisitRemoteActionCall?(node: FlowNode, parent?: FlowNode): void;

    beginVisitResourceActionCall?(node: FlowNode, parent?: FlowNode): void;
    endVisitResourceActionCall?(node: FlowNode, parent?: FlowNode): void;

    beginVisitReturn?(node: FlowNode, parent?: FlowNode): void;
    endVisitReturn?(node: FlowNode, parent?: FlowNode): void;

    beginVisitEmpty?(node: FlowNode, parent?: FlowNode): void;
    endVisitEmpty?(node: FlowNode, parent?: FlowNode): void;

    beginVisitCodeBlock?(node: FlowNode, parent?: FlowNode): void;
    endVisitbeginVisitCodeBlock?(node: FlowNode, parent?: FlowNode): void;

    beginVisitDraft?(node: FlowNode, parent?: FlowNode): void;
    endVisitDraft?(node: FlowNode, parent?: FlowNode): void;

    beginVisitComment?(node: FlowNode, parent?: FlowNode): void;
    endVisitComment?(node: FlowNode, parent?: FlowNode): void;

    beginVisitErrorHandler?(node: FlowNode, parent?: FlowNode): void;
    endVisitErrorHandler?(node: FlowNode, parent?: FlowNode): void;

    beginVisitOnFailure?(node: Branch, parent?: FlowNode): void;
    endVisitOnFailure?(node: Branch, parent?: FlowNode): void;

    beginVisitFork?(node: FlowNode, parent?: FlowNode): void;
    endVisitFork?(node: FlowNode, parent?: FlowNode): void;

    beginVisitWorker?(node: Branch, parent?: FlowNode): void;
    endVisitWorker?(node: Branch, parent?: FlowNode): void;

    beginVisitAgentCall?(node: FlowNode, parent?: FlowNode): void;
    endVisitAgentCall?(node: FlowNode, parent?: FlowNode): void;

    beginVisitParallelFlow?(node: FlowNode, parent?: FlowNode): void;
    endVisitParallelFlow?(node: FlowNode, parent?: FlowNode): void;
}
