/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DiagramElement, Flow, Node, NodeBranch, Participant } from "../utils/types";

export interface BaseVisitor {
    // participants
    beginVisitParticipant?(participant: Participant, flow?: Flow): void;
    endVisitParticipant?(participant: Participant, flow?: Flow): void;

    beginVisitEndpoint?(participant: Participant, flow?: Flow): void;
    endVisitEndpoint?(participant: Participant, flow?: Flow): void;

    beginVisitFunction?(participant: Participant, flow?: Flow): void;
    endVisitFunction?(participant: Participant, flow?: Flow): void;

    // interactions
    beginVisitNode?(node: Node, parent?: DiagramElement): void;
    endVisitNode?(node: Node, parent?: DiagramElement): void;

    beginVisitInteraction?(node: Node, parent?: DiagramElement): void;
    endVisitInteraction?(node: Node, parent?: DiagramElement): void;

    beginVisitEndpointCall?(node: Node, parent?: DiagramElement): void;
    endVisitEndpointCall?(node: Node, parent?: DiagramElement): void;

    beginVisitFunctionCall?(node: Node, parent?: DiagramElement): void;
    endVisitFunctionCall?(node: Node, parent?: DiagramElement): void;

    beginVisitReturn?(node: Node, parent?: DiagramElement): void;
    endVisitReturn?(node: Node, parent?: DiagramElement): void;

    // operations
    beginVisitWhile?(node: Node, parent?: DiagramElement): void;
    endVisitWhile?(node: Node, parent?: DiagramElement): void;

    beginVisitIf?(node: Node, parent?: DiagramElement): void;
    endVisitIf?(node: Node, parent?: DiagramElement): void;

    beginVisitThen?(branch: NodeBranch, parent?: Node): void;
    endVisitThen?(branch: NodeBranch, parent?: Node): void;

    beginVisitElse?(branch: NodeBranch, parent?: Node): void;
    endVisitElse?(branch: NodeBranch, parent?: Node): void;
}
