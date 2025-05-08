/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

export enum NodeTypes {
    BASE_NODE = "base-node",
    PARTICIPANT_NODE = "participant-node",
    INTERACTION_NODE = "interaction-node",
    POINT_NODE = "point-node",
    LIFE_LINE_NODE = "life-line-node",
    EMPTY_NODE = "empty-node",
    CONTAINER_NODE = "container-node",
}

export const DIAGRAM_END = 10000;

export const NODE_LINK = "node-link";
export const NODE_PORT = "node-port";
export const LOADING_OVERLAY = "loading-overlay";

export const DEFAULT_CALLER = "default-caller";

export const NODE_WIDTH = 20;
export const NODE_HEIGHT = NODE_WIDTH;

export const BORDER_WIDTH = 1.5;

export const EMPTY_NODE_WIDTH = NODE_WIDTH;

export const PARTICIPANT_NODE_WIDTH = 160;
export const PARTICIPANT_NODE_HEIGHT = 40;
export const PARTICIPANT_TAIL_MIN_HEIGHT = 200;
export const PARTICIPANT_GAP_X = 60;

export const INTERACTION_NODE_WIDTH = NODE_WIDTH;
export const INTERACTION_NODE_HEIGHT = 14;
export const INTERACTION_GAP_Y = INTERACTION_NODE_HEIGHT + BORDER_WIDTH * 2;
export const INTERACTION_GROUP_GAP_Y = INTERACTION_GAP_Y * 3;

export const CONTAINER_PADDING = 8;
