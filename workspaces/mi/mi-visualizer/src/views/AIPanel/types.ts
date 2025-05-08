/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { FileObject, ImageObject } from "@wso2-enterprise/mi-core";

export type RpcClientType = ReturnType<typeof useVisualizerContext>["rpcClient"];
export interface MarkdownRendererProps {
    markdownContent: string;
}

export interface ApiResponse {
    event: string;
    error: string | null;
    questions: string[];
}

export interface EntryContainerProps {
    isOpen: boolean;
}

export interface FileHistoryEntry {
    filepath: string; 
    content: string;
    timestamp: number;
    currentAddedfFromChatIndex: number; 
    maxAddedFromChatIndex: number;
}

// Define enums for role and type
export enum Role {
    // UI roles
    MIUser = "User",
    MICopilot = "MI Copilot",
    default = "",
    
    // Copilot roles
    CopilotAssistant = "assistant",
    CopilotUser = "user"
}

export enum MessageType {
    UserMessage = "user_message",
    AssistantMessage = "assistant_message",
    Question = "question",
    Label = "label",
    InitialPrompt = "initial_prompt",
    Error = "Error"
}

// Type of entries shown in UI 
export type ChatMessage = {
    id?: number;
    role: Role.MICopilot | Role.MIUser | Role.default; 
    content: string;
    type: MessageType; 
    files?: FileObject[];
    images?: ImageObject[];
};

// Type of messeges send to MI Copilot backend 
export type CopilotChatEntry = {
    id: number;
    role: Role.CopilotUser | Role.CopilotAssistant;
    content: string;
    type?: MessageType;
};

// Type of messeges send to MI Copilot backend 
export type ChatEntry = {
    id: string;
    role: string; 
    content: string;
};

export enum BackendRequestType {
    InitialPrompt = "initial_prompt",
    QuestionClick = "question_click",
    UserPrompt = "user_prompt",
    Suggestions = "suggestions",
}
