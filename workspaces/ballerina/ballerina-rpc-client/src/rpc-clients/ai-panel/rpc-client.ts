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
import {
    AIChatSummary,
    AIPanelAPI,
    AIVisualizerState,
    AddToProjectRequest,
    AIPanelPrompt,
    DeleteFromProjectRequest,
    DeveloperDocument,
    FetchDataRequest,
    FetchDataResponse,
    GenerateMappingFromRecordResponse,
    GenerateMappingsFromRecordRequest,
    GenerateMappingsRequest,
    GenerateMappingsResponse,
    GenerateTypesFromRecordRequest,
    GenerateTypesFromRecordResponse,
    GetFromFileRequest,
    GetModuleDirParams,
    LLMDiagnostics,
    NotifyAIMappingsRequest,
    PostProcessRequest,
    PostProcessResponse,
    ProjectDiagnostics,
    ProjectSource,
    RequirementSpecification,
    TestGenerationMentions,
    TestGenerationRequest,
    TestGenerationResponse,
    abortTestGeneration,
    addChatSummary,
    addToProject,
    applyDoOnFailBlocks,
    checkSyntaxError,
    clearInitialPrompt,
    createTestDirecoryIfNotExists,
    deleteFromProject,
    fetchData,
    generateMappings,
    getAccessToken,
    getActiveFile,
    getAiPanelState,
    getBackendUrl,
    getContentFromFile,
    getDefaultPrompt,
    getDriftDiagnosticContents,
    getFileExists,
    getFromDocumentation,
    getFromFile,
    getGeneratedTests,
    getMappingsFromRecord,
    getModuleDirectory,
    getProjectSource,
    getProjectUuid,
    getRefreshToken,
    getResourceMethodAndPaths,
    getResourceSourceForMethodAndPath,
    getServiceNames,
    getServiceSourceForName,
    getShadowDiagnostics,
    getTestDiagnostics,
    getThemeKind,
    getTypesFromRecord,
    handleChatSummaryError,
    isCopilotSignedIn,
    isNaturalProgrammingDirectoryExists,
    isRequirementsSpecificationFileExist,
    isWSO2AISignedIn,
    login,
    logout,
    markAlertShown,
    notifyAIMappings,
    openChat,
    openSettings,
    postProcess,
    promptGithubAuthorize,
    promptLogin,
    promptWSO2AILogout,
    readDeveloperMdFile,
    showSignInAlert,
    stopAIMappings,
    updateDevelopmentDocument,
    updateRequirementSpecification
} from "@wso2-enterprise/ballerina-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class AiPanelRpcClient implements AIPanelAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    getBackendUrl(): Promise<string> {
        return this._messenger.sendRequest(getBackendUrl, HOST_EXTENSION);
    }

    getProjectUuid(): Promise<string> {
        return this._messenger.sendRequest(getProjectUuid, HOST_EXTENSION);
    }

    getAccessToken(): Promise<string> {
        return this._messenger.sendRequest(getAccessToken, HOST_EXTENSION);
    }

    getRefreshToken(): Promise<string> {
        return this._messenger.sendRequest(getRefreshToken, HOST_EXTENSION);
    }

    getDefaultPrompt(): Promise<AIPanelPrompt> {
        return this._messenger.sendRequest(getDefaultPrompt, HOST_EXTENSION);
    }

    login(): void {
        return this._messenger.sendNotification(login, HOST_EXTENSION);
    }

    logout(): void {
        return this._messenger.sendNotification(logout, HOST_EXTENSION);
    }

    getAiPanelState(): Promise<AIVisualizerState> {
        return this._messenger.sendRequest(getAiPanelState, HOST_EXTENSION);
    }

    fetchData(params: FetchDataRequest): Promise<FetchDataResponse> {
        return this._messenger.sendRequest(fetchData, HOST_EXTENSION, params);
    }

    addToProject(content: AddToProjectRequest): void {
        return this._messenger.sendNotification(addToProject, HOST_EXTENSION, content);
    }

    getFromFile(content: GetFromFileRequest): Promise<string> {
        return this._messenger.sendRequest(getFromFile, HOST_EXTENSION, content);
    }

    getFileExists(content: GetFromFileRequest): Promise<boolean> {
        return this._messenger.sendRequest(getFileExists, HOST_EXTENSION, content);
    }

    deleteFromProject(content: DeleteFromProjectRequest): void {
        return this._messenger.sendNotification(deleteFromProject, HOST_EXTENSION, content);
    }

    getThemeKind(): Promise<string> {
        return this._messenger.sendRequest(getThemeKind, HOST_EXTENSION);
    }

    generateMappings(params: GenerateMappingsRequest): Promise<GenerateMappingsResponse> {
        return this._messenger.sendRequest(generateMappings, HOST_EXTENSION, params);
    }

    notifyAIMappings(params: NotifyAIMappingsRequest): Promise<boolean> {
        return this._messenger.sendRequest(notifyAIMappings, HOST_EXTENSION, params);
    }

    stopAIMappings(): Promise<GenerateMappingsResponse> {
        return this._messenger.sendRequest(stopAIMappings, HOST_EXTENSION);
    }

    promptLogin(): Promise<boolean> {
        return this._messenger.sendRequest(promptLogin, HOST_EXTENSION);
    }

    getProjectSource(requestType: string): Promise<ProjectSource> {
        return this._messenger.sendRequest(getProjectSource, HOST_EXTENSION, requestType);
    }

    getShadowDiagnostics(project: ProjectSource): Promise<ProjectDiagnostics> {
        return this._messenger.sendRequest(getShadowDiagnostics, HOST_EXTENSION, project);
    }

    checkSyntaxError(project: ProjectSource): Promise<boolean> {
        return this._messenger.sendRequest(checkSyntaxError, HOST_EXTENSION, project);
    }

    clearInitialPrompt(): void {
        return this._messenger.sendNotification(clearInitialPrompt, HOST_EXTENSION);
    }

    getGeneratedTests(params: TestGenerationRequest): Promise<TestGenerationResponse> {
        return this._messenger.sendRequest(getGeneratedTests, HOST_EXTENSION, params);
    }

    getTestDiagnostics(params: TestGenerationResponse): Promise<ProjectDiagnostics> {
        return this._messenger.sendRequest(getTestDiagnostics, HOST_EXTENSION, params);
    }

    getServiceSourceForName(params: string): Promise<string> {
        return this._messenger.sendRequest(getServiceSourceForName, HOST_EXTENSION, params);
    }

    getResourceSourceForMethodAndPath(params: string): Promise<string> {
        return this._messenger.sendRequest(getResourceSourceForMethodAndPath, HOST_EXTENSION, params);
    }

    getServiceNames(): Promise<TestGenerationMentions> {
        return this._messenger.sendRequest(getServiceNames, HOST_EXTENSION);
    }

    getResourceMethodAndPaths(): Promise<TestGenerationMentions> {
        return this._messenger.sendRequest(getResourceMethodAndPaths, HOST_EXTENSION);
    }

    abortTestGeneration(): void {
        return this._messenger.sendNotification(abortTestGeneration, HOST_EXTENSION);
    }

    getMappingsFromRecord(params: GenerateMappingsFromRecordRequest): Promise<GenerateMappingFromRecordResponse> {
        return this._messenger.sendRequest(getMappingsFromRecord, HOST_EXTENSION, params);
    }

    getTypesFromRecord(params: GenerateTypesFromRecordRequest): Promise<GenerateTypesFromRecordResponse> {
        return this._messenger.sendRequest(getTypesFromRecord, HOST_EXTENSION, params);
    }

    applyDoOnFailBlocks(): void {
        return this._messenger.sendNotification(applyDoOnFailBlocks, HOST_EXTENSION);
    }

    postProcess(req: PostProcessRequest): Promise<PostProcessResponse> {
        return this._messenger.sendRequest(postProcess, HOST_EXTENSION, req);
    }

    getActiveFile(): Promise<string> {
        return this._messenger.sendRequest(getActiveFile, HOST_EXTENSION);
    }

    openSettings(): void {
        return this._messenger.sendNotification(openSettings, HOST_EXTENSION);
    }

    openChat(): void {
        return this._messenger.sendNotification(openChat, HOST_EXTENSION);
    }

    promptGithubAuthorize(): Promise<boolean> {
        return this._messenger.sendRequest(promptGithubAuthorize, HOST_EXTENSION);
    }

    promptWSO2AILogout(): Promise<boolean> {
        return this._messenger.sendRequest(promptWSO2AILogout, HOST_EXTENSION);
    }

    isCopilotSignedIn(): Promise<boolean> {
        return this._messenger.sendRequest(isCopilotSignedIn, HOST_EXTENSION);
    }

    isWSO2AISignedIn(): Promise<boolean> {
        return this._messenger.sendRequest(isWSO2AISignedIn, HOST_EXTENSION);
    }

    showSignInAlert(): Promise<boolean> {
        return this._messenger.sendRequest(showSignInAlert, HOST_EXTENSION);
    }

    markAlertShown(): void {
        return this._messenger.sendNotification(markAlertShown, HOST_EXTENSION);
    }

    getFromDocumentation(content: string): Promise<string> {
        return this._messenger.sendRequest(getFromDocumentation, HOST_EXTENSION, content);
    }

    isRequirementsSpecificationFileExist(filePath: string): Promise<boolean> {
        return this._messenger.sendRequest(isRequirementsSpecificationFileExist, HOST_EXTENSION, filePath);
    }

    getDriftDiagnosticContents(projectPath: string): Promise<LLMDiagnostics> {
        return this._messenger.sendRequest(getDriftDiagnosticContents, HOST_EXTENSION, projectPath);
    }

    addChatSummary(filepathAndSummary: AIChatSummary): Promise<boolean> {
        return this._messenger.sendRequest(addChatSummary, HOST_EXTENSION, filepathAndSummary);
    }

    handleChatSummaryError(message: string): void {
        return this._messenger.sendNotification(handleChatSummaryError, HOST_EXTENSION, message);
    }

    isNaturalProgrammingDirectoryExists(projectPath: string): Promise<boolean> {
        return this._messenger.sendRequest(isNaturalProgrammingDirectoryExists, HOST_EXTENSION, projectPath);
    }

    readDeveloperMdFile(directoryPath: string): Promise<string> {
        return this._messenger.sendRequest(readDeveloperMdFile, HOST_EXTENSION, directoryPath);
    }

    updateDevelopmentDocument(developerDocument: DeveloperDocument): void {
        return this._messenger.sendNotification(updateDevelopmentDocument, HOST_EXTENSION, developerDocument);
    }

    updateRequirementSpecification(requirementsSpecification: RequirementSpecification): void {
        return this._messenger.sendNotification(updateRequirementSpecification, HOST_EXTENSION, requirementsSpecification);
    }

    createTestDirecoryIfNotExists(directoryPath: string): void {
        return this._messenger.sendNotification(createTestDirecoryIfNotExists, HOST_EXTENSION, directoryPath);
    }

    getModuleDirectory(params: GetModuleDirParams): Promise<string> {
        return this._messenger.sendRequest(getModuleDirectory, HOST_EXTENSION, params);
    }

    getContentFromFile(content: GetFromFileRequest): Promise<string> {
        return this._messenger.sendRequest(getContentFromFile, HOST_EXTENSION, content);
    }
}
