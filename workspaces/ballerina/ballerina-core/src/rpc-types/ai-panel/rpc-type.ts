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
import { AIVisualizerState, AddToProjectRequest, GetFromFileRequest, DeleteFromProjectRequest, GenerateMappingsRequest, GenerateMappingsResponse, NotifyAIMappingsRequest, ProjectSource, ProjectDiagnostics, GenerateMappingsFromRecordRequest, GenerateMappingFromRecordResponse, PostProcessRequest, PostProcessResponse, GenerateTypesFromRecordRequest, GenerateTypesFromRecordResponse, FetchDataRequest, FetchDataResponse, TestGenerationRequest, TestGenerationResponse, TestGenerationMentions, AIChatSummary, DeveloperDocument, RequirementSpecification, LLMDiagnostics, GetModuleDirParams, AIPanelPrompt } from "./interfaces";
import { RequestType, NotificationType } from "vscode-messenger-common";

const _preFix = "ai-panel";
export const getBackendUrl: RequestType<void, string> = { method: `${_preFix}/getBackendUrl` };
export const getProjectUuid: RequestType<void, string> = { method: `${_preFix}/getProjectUuid` };
export const getAccessToken: RequestType<void, string> = { method: `${_preFix}/getAccessToken` };
export const getRefreshToken: RequestType<void, string> = { method: `${_preFix}/getRefreshToken` };
export const getDefaultPrompt: RequestType<void, AIPanelPrompt> = { method: `${_preFix}/getDefaultPrompt` };
export const login: NotificationType<void> = { method: `${_preFix}/login` };
export const logout: NotificationType<void> = { method: `${_preFix}/logout` };
export const getAiPanelState: RequestType<void, AIVisualizerState> = { method: `${_preFix}/getAiPanelState` };
export const fetchData: RequestType<FetchDataRequest, FetchDataResponse> = { method: `${_preFix}/fetchData` };
export const addToProject: NotificationType<AddToProjectRequest> = { method: `${_preFix}/addToProject` };
export const getFromFile: RequestType<GetFromFileRequest, string> = { method: `${_preFix}/getFromFile` };
export const getFileExists: RequestType<GetFromFileRequest, boolean> = { method: `${_preFix}/getFileExists` };
export const deleteFromProject: NotificationType<DeleteFromProjectRequest> = { method: `${_preFix}/deleteFromProject` };
export const getThemeKind: RequestType<void, string> = { method: `${_preFix}/getThemeKind` };
export const generateMappings: RequestType<GenerateMappingsRequest, GenerateMappingsResponse> = { method: `${_preFix}/generateMappings` };
export const notifyAIMappings: RequestType<NotifyAIMappingsRequest, boolean> = { method: `${_preFix}/notifyAIMappings` };
export const stopAIMappings: RequestType<void, GenerateMappingsResponse> = { method: `${_preFix}/stopAIMappings` };
export const promptLogin: RequestType<void, boolean> = { method: `${_preFix}/promptLogin` };
export const getProjectSource: RequestType<string, ProjectSource> = { method: `${_preFix}/getProjectSource` };
export const getShadowDiagnostics: RequestType<ProjectSource, ProjectDiagnostics> = { method: `${_preFix}/getShadowDiagnostics` };
export const checkSyntaxError: RequestType<ProjectSource, boolean> = { method: `${_preFix}/checkSyntaxError` };
export const clearInitialPrompt: NotificationType<void> = { method: `${_preFix}/clearInitialPrompt` };
export const getGeneratedTests: RequestType<TestGenerationRequest, TestGenerationResponse> = { method: `${_preFix}/getGeneratedTests` };
export const getTestDiagnostics: RequestType<TestGenerationResponse, ProjectDiagnostics> = { method: `${_preFix}/getTestDiagnostics` };
export const getServiceSourceForName: RequestType<string, string> = { method: `${_preFix}/getServiceSourceForName` };
export const getResourceSourceForMethodAndPath: RequestType<string, string> = { method: `${_preFix}/getResourceSourceForMethodAndPath` };
export const getServiceNames: RequestType<void, TestGenerationMentions> = { method: `${_preFix}/getServiceNames` };
export const getResourceMethodAndPaths: RequestType<void, TestGenerationMentions> = { method: `${_preFix}/getResourceMethodAndPaths` };
export const abortTestGeneration: NotificationType<void> = { method: `${_preFix}/abortTestGeneration` };
export const getMappingsFromRecord: RequestType<GenerateMappingsFromRecordRequest, GenerateMappingFromRecordResponse> = { method: `${_preFix}/getMappingsFromRecord` };
export const getTypesFromRecord: RequestType<GenerateTypesFromRecordRequest, GenerateTypesFromRecordResponse> = { method: `${_preFix}/getTypesFromRecord` };
export const applyDoOnFailBlocks: NotificationType<void> = { method: `${_preFix}/applyDoOnFailBlocks` };
export const postProcess: RequestType<PostProcessRequest, PostProcessResponse> = { method: `${_preFix}/postProcess` };
export const getActiveFile: RequestType<void, string> = { method: `${_preFix}/getActiveFile` };
export const openSettings: NotificationType<void> = { method: `${_preFix}/openSettings` };
export const openChat: NotificationType<void> = { method: `${_preFix}/openChat` };
export const promptGithubAuthorize: RequestType<void, boolean> = { method: `${_preFix}/promptGithubAuthorize` };
export const promptWSO2AILogout: RequestType<void, boolean> = { method: `${_preFix}/promptWSO2AILogout` };
export const isCopilotSignedIn: RequestType<void, boolean> = { method: `${_preFix}/isCopilotSignedIn` };
export const isWSO2AISignedIn: RequestType<void, boolean> = { method: `${_preFix}/isWSO2AISignedIn` };
export const showSignInAlert: RequestType<void, boolean> = { method: `${_preFix}/showSignInAlert` };
export const markAlertShown: NotificationType<void> = { method: `${_preFix}/markAlertShown` };
export const getFromDocumentation: RequestType<string, string> = { method: `${_preFix}/getFromDocumentation` };
export const isRequirementsSpecificationFileExist: RequestType<string, boolean> = { method: `${_preFix}/isRequirementsSpecificationFileExist` };
export const getDriftDiagnosticContents: RequestType<string, LLMDiagnostics> = { method: `${_preFix}/getDriftDiagnosticContents` };
export const addChatSummary: RequestType<AIChatSummary, boolean> = { method: `${_preFix}/addChatSummary` };
export const handleChatSummaryError: NotificationType<string> = { method: `${_preFix}/handleChatSummaryError` };
export const isNaturalProgrammingDirectoryExists: RequestType<string, boolean> = { method: `${_preFix}/isNaturalProgrammingDirectoryExists` };
export const readDeveloperMdFile: RequestType<string, string> = { method: `${_preFix}/readDeveloperMdFile` };
export const updateDevelopmentDocument: NotificationType<DeveloperDocument> = { method: `${_preFix}/updateDevelopmentDocument` };
export const updateRequirementSpecification: NotificationType<RequirementSpecification> = { method: `${_preFix}/updateRequirementSpecification` };
export const createTestDirecoryIfNotExists: NotificationType<string> = { method: `${_preFix}/createTestDirecoryIfNotExists` };
export const getModuleDirectory: RequestType<GetModuleDirParams, string> = { method: `${_preFix}/getModuleDirectory` };
export const getContentFromFile: RequestType<GetFromFileRequest, string> = { method: `${_preFix}/getContentFromFile` };
