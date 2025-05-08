/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import { AIGentToolsRequest, AIGentToolsResponse, AIModelsRequest, AINodesRequest, AINodesResponse, AIToolsRequest, AIToolsResponse, AIModelsResponse, MemoryManagersResponse, MemoryManagersRequest } from "../../interfaces/extended-lang-client";
import { AIAgentRequest, AIAgentResponse, AIAgentToolsUpdateRequest } from "./interfaces";
import { RequestType } from "vscode-messenger-common";

const _preFix = "ai-agent";
export const getAllAgents: RequestType<AINodesRequest, AINodesResponse> = { method: `${_preFix}/getAllAgents` };
export const getAllModels: RequestType<AIModelsRequest, AINodesResponse> = { method: `${_preFix}/getAllModels` };
export const getAllMemoryManagers: RequestType<MemoryManagersRequest, MemoryManagersResponse> = { method: `${_preFix}/getAllMemoryManagers` };
export const getModels: RequestType<AIModelsRequest, AIModelsResponse> = { method: `${_preFix}/getModels` };
export const getTools: RequestType<AIToolsRequest, AIToolsResponse> = { method: `${_preFix}/getTools` };
export const genTool: RequestType<AIGentToolsRequest, AIGentToolsResponse> = { method: `${_preFix}/genTool` };
export const createAIAgent: RequestType<AIAgentRequest, AIAgentResponse> = { method: `${_preFix}/createAIAgent` };
export const updateAIAgentTools: RequestType<AIAgentToolsUpdateRequest, AIAgentResponse> = { method: `${_preFix}/updateAIAgentTools` };
