/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import {
    ColorThemeKind,
    GettingStartedData,
    GoToSourceRequest,
    HistoryEntry,
    HistoryEntryResponse,
    LogRequest,
    MIVisualizerAPI,
    NotificationRequest,
    NotificationResponse,
    OpenExternalRequest,
    OpenExternalResponse,
    OpenViewRequest,
    ProjectOverviewResponse,
    ProjectStructureRequest,
    ProjectStructureResponse,
    ReadmeContentResponse,
    RetrieveContextRequest,
    RetrieveContextResponse,
    RuntimeServicesResponse,
    SampleDownloadRequest,
    AddConfigurableRequest,
    SwaggerProxyRequest,
    SwaggerProxyResponse,
    ToggleDisplayOverviewRequest,
    UpdateContextRequest,
    WorkspacesResponse,
    addToHistory,
    downloadSelectedSampleFromGithub,
    fetchSamplesFromGithub,
    focusOutput,
    getAvailableRuntimeServices,
    getCurrentThemeKind,
    addConfigurable,
    getHistory,
    getProjectOverview,
    getProjectStructure,
    getReadmeContent,
    getWorkspaces,
    goBack,
    goHome,
    goSelected,
    goToSource,
    log,
    isLegacyExpressionSupportEnabled,
    openExternal,
    openReadme,
    openView,
    reloadWindow,
    retrieveContext,
    sendSwaggerProxyRequest,
    showNotification,
    downloadJavaFromMI,
    downloadMI,
    selectFolder,
    SetupDetails,
    SetPathRequest,
    setPathsInWorkSpace,
    getSupportedMIVersionsHigherThan,
    getProjectSetupDetails,
    toggleDisplayOverview,
    updateContext,
    getProjectDetails,
    updateDependencies,
    updatePomValues,
    updateConfigFileValues,
    ProjectDetailsResponse,
    importOpenAPISpec,
    UpdateDependenciesRequest,
    UpdatePomValuesRequest,
    UpdateConfigValuesRequest,
    updateConnectorDependencies,
    ImportOpenAPISpecRequest,
    updateRuntimeVersionsInPom,
    PathDetailsResponse,
    updateLegacyExpressionSupport, 
    updateDependenciesFromOverview,
    DownloadMIRequest
} from "@wso2-enterprise/mi-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class MiVisualizerRpcClient implements MIVisualizerAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    getWorkspaces(): Promise<WorkspacesResponse> {
        return this._messenger.sendRequest(getWorkspaces, HOST_EXTENSION);
    }

    getProjectStructure(params: ProjectStructureRequest): Promise<ProjectStructureResponse> {
        return this._messenger.sendRequest(getProjectStructure, HOST_EXTENSION, params);
    }

    getProjectOverview(params: ProjectStructureRequest): Promise<ProjectOverviewResponse> {
        return this._messenger.sendRequest(getProjectOverview, HOST_EXTENSION, params);
    }

    getCurrentThemeKind(): Promise<ColorThemeKind> {
        return this._messenger.sendRequest(getCurrentThemeKind, HOST_EXTENSION);
    }

    openView(params: OpenViewRequest): void {
        return this._messenger.sendNotification(openView, HOST_EXTENSION, params);
    }

    reloadWindow(): Promise<void> {
        return this._messenger.sendRequest(reloadWindow, HOST_EXTENSION);
    }

    goBack(): void {
        return this._messenger.sendNotification(goBack, HOST_EXTENSION);
    }

    fetchSamplesFromGithub(): Promise<GettingStartedData> {
        return this._messenger.sendRequest(fetchSamplesFromGithub, HOST_EXTENSION);
    }

    downloadSelectedSampleFromGithub(params: SampleDownloadRequest): void {
        return this._messenger.sendNotification(downloadSelectedSampleFromGithub, HOST_EXTENSION, params);
    }

    addConfigurable(params: AddConfigurableRequest): Promise<void> {
        return this._messenger.sendRequest(addConfigurable, HOST_EXTENSION, params);
    }

    getHistory(): Promise<HistoryEntryResponse> {
        return this._messenger.sendRequest(getHistory, HOST_EXTENSION);
    }

    addToHistory(params: HistoryEntry): void {
        return this._messenger.sendNotification(addToHistory, HOST_EXTENSION, params);
    }

    goHome(): void {
        return this._messenger.sendNotification(goHome, HOST_EXTENSION);
    }

    goSelected(params: number): void {
        return this._messenger.sendNotification(goSelected, HOST_EXTENSION, params);
    }

    toggleDisplayOverview(params: ToggleDisplayOverviewRequest): Promise<void> {
        return this._messenger.sendRequest(toggleDisplayOverview, HOST_EXTENSION, params);
    }

    goToSource(params: GoToSourceRequest): void {
        return this._messenger.sendNotification(goToSource, HOST_EXTENSION, params);
    }

    focusOutput(): void {
        return this._messenger.sendNotification(focusOutput, HOST_EXTENSION);
    }

    log(params: LogRequest): void {
        return this._messenger.sendNotification(log, HOST_EXTENSION, params);
    }

    updateContext(params: UpdateContextRequest): Promise<void> {
        return this._messenger.sendRequest(updateContext, HOST_EXTENSION, params);
    }

    retrieveContext(params: RetrieveContextRequest): Promise<RetrieveContextResponse> {
        return this._messenger.sendRequest(retrieveContext, HOST_EXTENSION, params);
    }

    showNotification(params: NotificationRequest): Promise<NotificationResponse> {
        return this._messenger.sendRequest(showNotification, HOST_EXTENSION, params);
    }

    getAvailableRuntimeServices(): Promise<RuntimeServicesResponse> {
        return this._messenger.sendRequest(getAvailableRuntimeServices, HOST_EXTENSION);
    }

    sendSwaggerProxyRequest(params: SwaggerProxyRequest): Promise<SwaggerProxyResponse> {
        return this._messenger.sendRequest(sendSwaggerProxyRequest, HOST_EXTENSION, params);
    }

    openExternal(params: OpenExternalRequest): Promise<OpenExternalResponse> {
        return this._messenger.sendRequest(openExternal, HOST_EXTENSION, params);
    }

    getReadmeContent(): Promise<ReadmeContentResponse> {
        return this._messenger.sendRequest(getReadmeContent, HOST_EXTENSION);
    }

    openReadme(): void {
        return this._messenger.sendNotification(openReadme, HOST_EXTENSION);
    }

    downloadJavaFromMI(params: string): Promise<string> {
        return this._messenger.sendRequest(downloadJavaFromMI, HOST_EXTENSION, params);
    }

    downloadMI(params: DownloadMIRequest): Promise<string> {
        return this._messenger.sendRequest(downloadMI, HOST_EXTENSION, params);
    }

    getSupportedMIVersionsHigherThan(params: string): Promise<string[]> {
        return this._messenger.sendRequest(getSupportedMIVersionsHigherThan, HOST_EXTENSION,params);
    }

    getProjectSetupDetails(): Promise<SetupDetails> {
        return this._messenger.sendRequest(getProjectSetupDetails, HOST_EXTENSION);
    }
    updateRuntimeVersionsInPom(params:string): Promise<boolean> {
        return this._messenger.sendRequest(updateRuntimeVersionsInPom, HOST_EXTENSION, params);
    }
    setPathsInWorkSpace(params: SetPathRequest): Promise<PathDetailsResponse> {
        return this._messenger.sendRequest(setPathsInWorkSpace, HOST_EXTENSION, params);
    }
    
    selectFolder(params:string): Promise<string|undefined> {
        return this._messenger.sendRequest(selectFolder, HOST_EXTENSION, params);
    }
    getProjectDetails(): Promise<ProjectDetailsResponse> {
        return this._messenger.sendRequest(getProjectDetails, HOST_EXTENSION);
    }
    updateDependencies(params: UpdateDependenciesRequest): Promise<boolean> {
        return this._messenger.sendRequest(updateDependencies, HOST_EXTENSION, params);
    }
    updatePomValues(params: UpdatePomValuesRequest): Promise<boolean> {
        return this._messenger.sendRequest(updatePomValues, HOST_EXTENSION, params);
    }
    updateConfigFileValues(params: UpdateConfigValuesRequest): Promise<boolean> {
        return this._messenger.sendRequest(updateConfigFileValues, HOST_EXTENSION, params);
    }
    updateConnectorDependencies(): Promise<string> {
        return this._messenger.sendRequest(updateConnectorDependencies, HOST_EXTENSION);
    }
    updateDependenciesFromOverview(params: UpdateDependenciesRequest): Promise<boolean> {
        return this._messenger.sendRequest(updateDependenciesFromOverview, HOST_EXTENSION, params);
    }
    importOpenAPISpec(params: ImportOpenAPISpecRequest): Promise<void> {
        return this._messenger.sendRequest(importOpenAPISpec, HOST_EXTENSION, params);
    }
    updateLegacyExpressionSupport(value: boolean): Promise<void> {
        return this._messenger.sendRequest(updateLegacyExpressionSupport, HOST_EXTENSION, value);
    }

    isLegacyExpressionSupportEnabled(): Promise<boolean> {
        return this._messenger.sendRequest(isLegacyExpressionSupportEnabled, HOST_EXTENSION);
    }
}
