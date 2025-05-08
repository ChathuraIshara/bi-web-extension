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
    AddToProjectRequest,
    DeleteFromProjectRequest,
    DeveloperDocument,
    FetchDataRequest,
    GenerateMappingsFromRecordRequest,
    GenerateMappingsRequest,
    GenerateTypesFromRecordRequest,
    GetFromFileRequest,
    GetModuleDirParams,
    NotifyAIMappingsRequest,
    PostProcessRequest,
    ProjectSource,
    RequirementSpecification,
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
import { Messenger } from "vscode-messenger";
import { AiPanelRpcManager } from "./rpc-manager";

export function registerAiPanelRpcHandlers(messenger: Messenger) {
    const rpcManger = new AiPanelRpcManager();
    messenger.onRequest(getBackendUrl, () => rpcManger.getBackendUrl());
    messenger.onRequest(getProjectUuid, () => rpcManger.getProjectUuid());
    messenger.onRequest(getAccessToken, () => rpcManger.getAccessToken());
    messenger.onRequest(getRefreshToken, () => rpcManger.getRefreshToken());
    messenger.onRequest(getDefaultPrompt, () => rpcManger.getDefaultPrompt());
    messenger.onNotification(login, () => rpcManger.login());
    messenger.onNotification(logout, () => rpcManger.logout());
    messenger.onRequest(getAiPanelState, () => rpcManger.getAiPanelState());
    messenger.onRequest(fetchData, (args: FetchDataRequest) => rpcManger.fetchData(args));
    messenger.onNotification(addToProject, (args: AddToProjectRequest) => rpcManger.addToProject(args));
    messenger.onRequest(getFromFile, (args: GetFromFileRequest) => rpcManger.getFromFile(args));
    messenger.onRequest(getFileExists, (args: GetFromFileRequest) => rpcManger.getFileExists(args));
    messenger.onNotification(deleteFromProject, (args: DeleteFromProjectRequest) => rpcManger.deleteFromProject(args));
    messenger.onRequest(getThemeKind, () => rpcManger.getThemeKind());
    messenger.onRequest(generateMappings, (args: GenerateMappingsRequest) => rpcManger.generateMappings(args));
    messenger.onRequest(notifyAIMappings, (args: NotifyAIMappingsRequest) => rpcManger.notifyAIMappings(args));
    messenger.onRequest(stopAIMappings, () => rpcManger.stopAIMappings());
    messenger.onRequest(promptLogin, () => rpcManger.promptLogin());
    messenger.onRequest(getProjectSource, (args: string) => rpcManger.getProjectSource(args));
    messenger.onRequest(getShadowDiagnostics, (args: ProjectSource) => rpcManger.getShadowDiagnostics(args));
    messenger.onRequest(checkSyntaxError, (args: ProjectSource) => rpcManger.checkSyntaxError(args));
    messenger.onNotification(clearInitialPrompt, () => rpcManger.clearInitialPrompt());
    messenger.onRequest(getGeneratedTests, (args: TestGenerationRequest) => rpcManger.getGeneratedTests(args));
    messenger.onRequest(getTestDiagnostics, (args: TestGenerationResponse) => rpcManger.getTestDiagnostics(args));
    messenger.onRequest(getServiceSourceForName, (args: string) => rpcManger.getServiceSourceForName(args));
    messenger.onRequest(getResourceSourceForMethodAndPath, (args: string) => rpcManger.getResourceSourceForMethodAndPath(args));
    messenger.onRequest(getServiceNames, () => rpcManger.getServiceNames());
    messenger.onRequest(getResourceMethodAndPaths, () => rpcManger.getResourceMethodAndPaths());
    messenger.onNotification(abortTestGeneration, () => rpcManger.abortTestGeneration());
    messenger.onRequest(getMappingsFromRecord, (args: GenerateMappingsFromRecordRequest) => rpcManger.getMappingsFromRecord(args));
    messenger.onRequest(getTypesFromRecord, (args: GenerateTypesFromRecordRequest) => rpcManger.getTypesFromRecord(args));
    messenger.onNotification(applyDoOnFailBlocks, () => rpcManger.applyDoOnFailBlocks());
    messenger.onRequest(postProcess, (args: PostProcessRequest) => rpcManger.postProcess(args));
    messenger.onRequest(getActiveFile, () => rpcManger.getActiveFile());
    messenger.onNotification(openSettings, () => rpcManger.openSettings());
    messenger.onNotification(openChat, () => rpcManger.openChat());
    messenger.onRequest(promptGithubAuthorize, () => rpcManger.promptGithubAuthorize());
    messenger.onRequest(promptWSO2AILogout, () => rpcManger.promptWSO2AILogout());
    messenger.onRequest(isCopilotSignedIn, () => rpcManger.isCopilotSignedIn());
    messenger.onRequest(isWSO2AISignedIn, () => rpcManger.isWSO2AISignedIn());
    messenger.onRequest(showSignInAlert, () => rpcManger.showSignInAlert());
    messenger.onNotification(markAlertShown, () => rpcManger.markAlertShown());
    messenger.onRequest(getFromDocumentation, (args: string) => rpcManger.getFromDocumentation(args));
    messenger.onRequest(isRequirementsSpecificationFileExist, (args: string) => rpcManger.isRequirementsSpecificationFileExist(args));
    messenger.onRequest(getDriftDiagnosticContents, (args: string) => rpcManger.getDriftDiagnosticContents(args));
    messenger.onRequest(addChatSummary, (args: AIChatSummary) => rpcManger.addChatSummary(args));
    messenger.onNotification(handleChatSummaryError, (args: string) => rpcManger.handleChatSummaryError(args));
    messenger.onRequest(isNaturalProgrammingDirectoryExists, (args: string) => rpcManger.isNaturalProgrammingDirectoryExists(args));
    messenger.onRequest(readDeveloperMdFile, (args: string) => rpcManger.readDeveloperMdFile(args));
    messenger.onNotification(updateDevelopmentDocument, (args: DeveloperDocument) => rpcManger.updateDevelopmentDocument(args));
    messenger.onNotification(updateRequirementSpecification, (args: RequirementSpecification) => rpcManger.updateRequirementSpecification(args));
    messenger.onNotification(createTestDirecoryIfNotExists, (args: string) => rpcManger.createTestDirecoryIfNotExists(args));
    messenger.onRequest(getModuleDirectory, (args: GetModuleDirParams) => rpcManger.getModuleDirectory(args));
    messenger.onRequest(getContentFromFile, (args: GetFromFileRequest) => rpcManger.getContentFromFile(args));
}
