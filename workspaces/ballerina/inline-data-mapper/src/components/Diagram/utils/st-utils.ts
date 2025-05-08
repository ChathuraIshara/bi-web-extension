/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface NodePosition {
    start: number;
    end: number;
}

export function getPosition(node: Node): NodePosition {
    return {
        start: 0,
        end: 0
    };
}

export function isPositionsEquals(node1: NodePosition, node2: NodePosition): boolean {
    return node1.start === node2.start
        && node1.end === node2.end;
}
