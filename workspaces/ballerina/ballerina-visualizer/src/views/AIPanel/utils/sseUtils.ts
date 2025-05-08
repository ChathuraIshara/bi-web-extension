/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface CopilotMessageStartContent {
    input_tokens: number;
};

export interface CopilotContentBlockContent {
    text: string;
};

export interface CopilotErrorContent {
    message: string;
};

export interface CopilotMessageStopContent {
    total_input_tokens: number;
    output_tokens: number;
    stop_reason?: string;
};

export enum CopilotEvent {
    MESSAGE_START = "message_start",
    CONTENT_BLOCK = "content_block",
    ERROR = "error",
    MESSAGE_STOP = "message_stop",
}

export interface CopilotSSEEvent {
    event: CopilotEvent;
    body: CopilotMessageStartContent | CopilotContentBlockContent | CopilotErrorContent | CopilotMessageStopContent;
}

export function parseCopilotSSEEvent(chunk: string): CopilotSSEEvent {
    let event: string | undefined;
    let dataLines: string[] = [];

    chunk.split("\n").forEach((line) => {
        if (line.startsWith("event: ")) {
            event = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
            dataLines.push(line.slice(6).trim());
        }
    });

    if (!event) {
        throw new Error("Event field is missing in SSE event");
    }

    let body: any;
    try {
        body = JSON.parse(dataLines.join(""));
    } catch (e) {
        throw new Error("Invalid JSON data in SSE event");
    }

    switch (event) {
        case "message_start":
            return { event: CopilotEvent.MESSAGE_START, body: body as CopilotMessageStartContent };
        case "content_block":
            return { event: CopilotEvent.CONTENT_BLOCK, body: body as CopilotContentBlockContent };
        case "error":
            return { event: CopilotEvent.ERROR, body: body as CopilotErrorContent };
        case "message_stop":
            return { event: CopilotEvent.MESSAGE_STOP, body: body as CopilotMessageStopContent };
    }
}

export function hasCodeBlocks(text: string) {
    const codeBlockRegex = /<code[^>]*>[\s\S]*?<\/code>/i;
    return codeBlockRegex.test(text);
}
