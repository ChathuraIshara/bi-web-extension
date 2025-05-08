/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DiagramElement, ParticipantType, Participant, NodeKind, InteractionType, Node, NodeBranch } from "./types";

export class DiagramElementKindChecker {
    static isParticipant(element: DiagramElement): element is Participant {
        return element.kind === ParticipantType.ENDPOINT || element.kind === ParticipantType.FUNCTION;
    }

    static isEndpoint(element: DiagramElement): element is Node {
        return element.kind === ParticipantType.ENDPOINT;
    }

    static isFunction(element: DiagramElement): element is Node {
        return element.kind === ParticipantType.FUNCTION;
    }

    static isNode(element: DiagramElement): element is Node {
        return element.kind === NodeKind.INTERACTION || element.kind === NodeKind.IF || element.kind === NodeKind.WHILE;
    }

    static isInteraction(element: DiagramElement): element is Node {
        return element.kind === NodeKind.INTERACTION;
    }

    static isEndpointCall(element: DiagramElement): element is Node {
        return element.kind === NodeKind.INTERACTION && element.interactionType === InteractionType.ENDPOINT_CALL;
    }

    static isFunctionCall(element: DiagramElement): element is Node {
        return element.kind === NodeKind.INTERACTION && element.interactionType === InteractionType.FUNCTION_CALL;
    }

    static isReturn(element: DiagramElement): element is Node {
        return element.kind === NodeKind.INTERACTION && element.interactionType === InteractionType.RETURN;
    }

    static isIf(element: DiagramElement): element is Node {
        return element.kind === NodeKind.IF;
    }

    static isWhile(element: DiagramElement): element is Node {
        return element.kind === NodeKind.WHILE;
    }
}
