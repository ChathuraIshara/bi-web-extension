/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export enum NodeTypes {
    BASE_NODE = "base-node",
    EMPTY_NODE = "empty-node",
    DRAFT_NODE = "draft-node",
    IF_NODE = "if-node",
    WHILE_NODE = "while-node",
    START_NODE = "start-node",
    API_CALL_NODE = "api-call-node",
    COMMENT_NODE = "comment-node",
    BUTTON_NODE = "button-node",
    CODE_BLOCK_NODE = "code-block-node",
    END_NODE = "end-node",
    ERROR_NODE = "error-node",
    AGENT_CALL_NODE = "agent-call-node",
    PROMPT_NODE = "prompt-node",
}

export const NODE_LINK = "node-link";
export const NODE_PORT = "node-port";
export const LOADING_OVERLAY = "loading-overlay";

// sizing
export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 50;

export const LABEL_HEIGHT = 20;
export const LABEL_WIDTH = 180;

export const NODE_BORDER_WIDTH = 1.8;

export const NODE_PADDING = 8;

// position
export const DIAGRAM_CENTER_X = 0;
export const NODE_GAP_Y = 50;
export const NODE_GAP_X = 60;

// custom nodes
export const IF_NODE_WIDTH = 65;
export const WHILE_NODE_WIDTH = 52;
export const EMPTY_NODE_WIDTH = 16;
export const EMPTY_NODE_CONTAINER_WIDTH = NODE_WIDTH / 2;
export const END_NODE_WIDTH = 20;
export const CONTAINER_PADDING = 8;

// draft node
export const DRAFT_NODE_WIDTH = NODE_WIDTH;
export const DRAFT_NODE_HEIGHT = NODE_HEIGHT;
export const DRAFT_NODE_BORDER_WIDTH = 2;

// popup box
export const POPUP_BOX_WIDTH = NODE_WIDTH + NODE_GAP_X + 20;
export const POPUP_BOX_HEIGHT = 58;

// button node
export const BUTTON_NODE_WIDTH = 160;
export const BUTTON_NODE_HEIGHT = 30;

// comment node
export const COMMENT_NODE_WIDTH = 200;
export const COMMENT_NODE_GAP = 30;
export const COMMENT_NODE_CIRCLE_WIDTH = 8;

// custom nodes
export const START_CONTAINER = "startContainer";
export const END_CONTAINER = "endContainer";
export const START_NODE = "startNode";
export const LAST_NODE = "lastNode";

// agent node
export const AGENT_NODE_TOOL_GAP = 5;
export const AGENT_NODE_TOOL_SECTION_GAP = 120;
export const AGENT_NODE_ADD_TOOL_BUTTON_WIDTH = 20;

// prompt node
export const PROMPT_NODE_WIDTH = 350;
export const PROMPT_NODE_HEIGHT = 300;
