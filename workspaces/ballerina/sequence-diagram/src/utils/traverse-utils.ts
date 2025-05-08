/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { chain } from "lodash";
import { BaseVisitor } from "../visitors/BaseVisitor";
import { DiagramElement, Flow, Node, NodeKind, Participant } from "./types";
import { DiagramElementKindChecker } from "./check-kind-utils";

// this will traverse the flow and jump to other participants
export function traverseParticipantFlow(
    participant: Participant,
    visitor: BaseVisitor,
    flow: Flow,
    caller?: DiagramElement,
) {
    if (!participant.kind) {
        console.warn("Node kind is not defined", participant);
        return;
    }
    const name = chain(participant.kind).camelCase().upperFirst().value();

    let beginVisitFn: any = (visitor as any)[`beginVisit${name}`];
    if (!beginVisitFn) {
        beginVisitFn = visitor.beginVisitParticipant && visitor.beginVisitParticipant;
    }

    if (beginVisitFn && !skipNodeVisit(participant)) {
        beginVisitFn.bind(visitor)(participant, flow);
    }

    const keys = Object.keys(participant);
    keys.forEach((key) => {
        if (skipAttribute(key)) {
            return;
        }
        const childNode = (participant as any)[key] as any;
        if (Array.isArray(childNode)) {
            childNode.forEach((elementNode) => {
                // if (!elementNode?.kind) {
                //     return;
                // }
                traverseNodeFlow(elementNode, visitor, caller || participant, flow);
            });
            return;
        }

        if (!childNode.kind) {
            return;
        }
        traverseNodeFlow(childNode, visitor, caller || participant, flow);
    });

    let endVisitFn: any = (visitor as any)[`endVisit${name}`];
    if (!endVisitFn) {
        endVisitFn = visitor.endVisitParticipant && visitor.endVisitParticipant;
    }
    if (endVisitFn && !skipNodeVisit(participant)) {
        endVisitFn.bind(visitor)(participant, flow);
    }
}

// this will traverse the flow and jump to other participants
export function traverseNodeFlow(node: Node, visitor: BaseVisitor, parent: DiagramElement, flow: Flow) {
    if (!node.kind) {
        console.warn("Node kind is not defined", node);
        // return;
    }
    let name = chain(node.kind).camelCase().upperFirst().value();
    if (node.kind === NodeKind.INTERACTION) {
        name = chain(node.interactionType).camelCase().upperFirst().value();
    }
    let beginVisitFn: any = (visitor as any)[`beginVisit${name}`];
    if (!beginVisitFn) {
        beginVisitFn = visitor.beginVisitNode && visitor.beginVisitNode;
    }

    if (beginVisitFn && !skipNodeVisit(node)) {
        beginVisitFn.bind(visitor)(node, parent);
    }

    // navigate to another participant
    if (DiagramElementKindChecker.isInteraction(node) && node.targetId) {
        const targetParticipant = flow.participants.find((p) => p.id === node.targetId);
        if (targetParticipant) {
            traverseParticipantFlow(targetParticipant, visitor, flow, node);
        }
    }

    const keys = Object.keys(node);
    keys.forEach((key) => {
        if (skipAttribute(key)) {
            return;
        }
        const childNode = (node as any)[key] as any;
        if (Array.isArray(childNode)) {
            childNode.forEach((elementNode) => {
                // if (!elementNode?.kind) {
                //     return;
                // }

                traverseNodeFlow(elementNode, visitor, node, flow);
            });
            return;
        }

        if (!childNode.kind) {
            return;
        }

        traverseNodeFlow(childNode, visitor, node, flow);
    });

    let endVisitFn: any = (visitor as any)[`endVisit${name}`];
    if (!endVisitFn) {
        endVisitFn = visitor.endVisitNode && visitor.endVisitNode;
    }

    if (endVisitFn && !skipNodeVisit(node)) {
        endVisitFn.bind(visitor)(node, parent);
    }
}

// this will traverse the flow participant one by one top to bottom
export function traverseFlow(flow: Flow, visitor: BaseVisitor) {
    flow.participants.forEach((participant) => {
        traverseParticipant(participant, visitor, flow);
    });
}

// this will traverse the participant top to bottom
export function traverseParticipant(node: Participant, visitor: BaseVisitor, parent?: Flow) {
    if (!node.kind) {
        console.warn("Node kind is not defined", node);
        return;
    }
    const name = chain(node.kind).camelCase().upperFirst().value();

    let beginVisitFn: any = (visitor as any)[`beginVisit${name}`];
    if (!beginVisitFn) {
        beginVisitFn = visitor.beginVisitParticipant && visitor.beginVisitParticipant;
    }

    if (beginVisitFn) {
        beginVisitFn.bind(visitor)(node, parent);
    }

    const keys = Object.keys(node);
    keys.forEach((key) => {
        const childNode = (node as any)[key] as any;
        if (Array.isArray(childNode)) {
            childNode.forEach((elementNode) => {
                if (!elementNode?.kind) {
                    return;
                }

                traverseNode(elementNode, visitor, node, node.id);
            });
            return;
        }

        if (!childNode.kind) {
            return;
        }

        traverseNode(childNode, visitor, node, node.id);
    });

    let endVisitFn: any = (visitor as any)[`endVisit${name}`];
    if (!endVisitFn) {
        endVisitFn = visitor.endVisitParticipant && visitor.endVisitParticipant;
    }

    if (endVisitFn) {
        endVisitFn.bind(visitor)(node, parent);
    }
}

// this will traverse the node top to bottom
export function traverseNode(node: Node, visitor: BaseVisitor, parent: DiagramElement, participantId: string) {
    if (!(node.kind || (node as any).label)) {
        // console.warn("Node kind or label not defined", node);
        return;
    }
    const name = chain(node.kind || (node as any).label)
        .camelCase()
        .upperFirst()
        .value();

    let beginVisitFn: any = (visitor as any)[`beginVisit${name}`];
    if (!beginVisitFn) {
        beginVisitFn = visitor.beginVisitNode && visitor.beginVisitNode;
    }

    if (beginVisitFn && node) {
        beginVisitFn.bind(visitor)(node, parent);
    }

    const keys = Object.keys(node);
    keys.forEach((key) => {
        const childNode = (node as any)[key] as any;
        if (Array.isArray(childNode)) {
            childNode.forEach((elementNode) => {
                // if (!elementNode?.kind) {
                //     return;
                // }

                traverseNode(elementNode, visitor, node, participantId);
            });
            return;
        }

        // if (!childNode.kind) {
        //     return;
        // }

        traverseNode(childNode, visitor, node, participantId);
    });

    let endVisitFn: any = (visitor as any)[`endVisit${name}`];
    if (!endVisitFn) {
        endVisitFn = visitor.endVisitNode && visitor.endVisitNode;
    }

    if (endVisitFn) {
        endVisitFn.bind(visitor)(node, parent);
    }
}

function skipAttribute(key: string) {
    return key === "viewStates" || key === "viewState";
}

function skipNodeVisit(el: DiagramElement) {
    return !el.kind;
}
