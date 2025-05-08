/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodePosition } from "@wso2-enterprise/syntax-tree";
import { CodeData, FlowNode } from "../../interfaces/bi";

export interface AgentTool {
    toolName: string;
    toolType: string;

    // Function Related
    functionState: number; // 1 = New, 2 = Existing
    functionScope: string; // Current Integration | Library
    functionName: string;
    existingFunctionCodeData: CodeData;

    //Connector Related
    connectorState: number; // 1 = New, 2 = Existing

    // For new connector option we will collect the config updated connectorFlowNode
    connectorFlowNode: FlowNode;
    // For both new and existing We will collect the action code data which can be used to the get the template of that "REMOTE_ACTION_CALL"
    connectorActionCodeData: CodeData;
    connectionName: string;
}

export interface AgentToolRequest {
    toolName: string;
    description: string;
    selectedCodeData: CodeData; // Codedata can be FUNCTION_CALL | REMOTE_ACTION_CALL
}

export interface AIAgentRequest {
    agentFields: any[]; // Need to fix this type
    modelFields: any[];
    modelState: number; // 1 = New, 2 = Existing
    selectedModel: string;
    toolsFields: any[];
    newTools: AgentToolRequest[];
}
export interface AIAgentToolsUpdateRequest {
    agentFlowNode: FlowNode;
    toolsFields: any[];
    newTools: AgentToolRequest[];
}

export interface AIAgentResponse {
    response: boolean;
    filePath: string;
    position: NodePosition;
}

