/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AIGentToolsRequest, AIGentToolsResponse, AIModelsRequest, AINodesRequest, AINodesResponse, AIToolsRequest, AIToolsResponse, AIModelsResponse, MemoryManagersResponse, MemoryManagersRequest } from "../../interfaces/extended-lang-client";
import { AIAgentRequest, AIAgentResponse, AIAgentToolsUpdateRequest } from "./interfaces";

export interface AIAgentAPI {
    getAllAgents: (params: AINodesRequest) => Promise<AINodesResponse>;
    getAllModels: (params: AIModelsRequest) => Promise<AINodesResponse>;
    getAllMemoryManagers: (params: MemoryManagersRequest) => Promise<MemoryManagersResponse>;
    getModels: (params: AIModelsRequest) => Promise<AIModelsResponse>;
    getTools: (params: AIToolsRequest) => Promise<AIToolsResponse>;
    genTool: (params: AIGentToolsRequest) => Promise<AIGentToolsResponse>;
    createAIAgent: (params: AIAgentRequest) => Promise<AIAgentResponse>;
    updateAIAgentTools: (params: AIAgentToolsUpdateRequest) => Promise<AIAgentResponse>;
}
