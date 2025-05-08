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
    EVENT_TYPE,
    GettingStartedCategory,
    GettingStartedData,
    GettingStartedSample,
    GoToSourceRequest,
    HistoryEntry,
    HistoryEntryResponse,
    LogRequest,
    MACHINE_VIEW,
    SetupDetails,
    SetPathRequest,
    MIVisualizerAPI,
    NotificationRequest,
    NotificationResponse,
    OpenExternalRequest,
    OpenExternalResponse,
    OpenViewRequest,
    POPUP_EVENT_TYPE,
    PopupVisualizerLocation,
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
    VisualizerLocation,
    WorkspaceFolder,
    WorkspacesResponse,
    ProjectDetailsResponse,
    UpdateDependenciesRequest,
    UpdatePomValuesRequest,
    UpdateConfigValuesRequest,
    ImportOpenAPISpecRequest,
    PathDetailsResponse,
    DownloadMIRequest,
} from "@wso2-enterprise/mi-core";
import * as https from "https";
import Mustache from "mustache";
import fetch from 'node-fetch';
import * as vscode from 'vscode';
import { Position, Uri, ViewColumn, WorkspaceEdit, commands, env, window, workspace, Range } from "vscode";
import * as os from 'os';
import { extension } from "../../MIExtensionContext";
import { DebuggerConfig } from "../../debugger/config";
import { history } from "../../history";
import { StateMachine, navigate, openView } from "../../stateMachine";
import { goToSource, handleOpenFile, appendContent, selectFolderDialog } from "../../util/fileOperations";
import { openAIWebview } from "../../ai-panel/aiMachine";
import { openPopupView } from "../../stateMachinePopup";
import { SwaggerServer } from "../../swagger/server";
import { log, outputChannel } from "../../util/logger";
import { escapeXml } from '../../util/templates';
import path from "path";
import { copy } from 'fs-extra';

const fs = require('fs');
import { TextEdit } from "vscode-languageclient";
import { downloadJavaFromMI, downloadMI, getProjectSetupDetails, getSupportedMIVersionsHigherThan, setPathsInWorkSpace, updateRuntimeVersionsInPom } from '../../util/onboardingUtils';

Mustache.escape = escapeXml;
export class MiVisualizerRpcManager implements MIVisualizerAPI {
    async getWorkspaces(): Promise<WorkspacesResponse> {
        return new Promise(async (resolve) => {
            const workspaces = workspace.workspaceFolders;
            const response: WorkspaceFolder[] = (workspaces ?? []).map(space => ({
                index: space.index,
                fsPath: space.uri.fsPath,
                name: space.name
            }));
            resolve({ workspaces: response });
        });
    }

    async getProjectStructure(params: ProjectStructureRequest): Promise<ProjectStructureResponse> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;
            const rootPath = workspace.workspaceFolders && workspace.workspaceFolders.length > 0 ?
                workspace.workspaceFolders[0].uri.fsPath
                : undefined;

            if (rootPath === undefined) {
                throw new Error("Error identifying workspace root");
            }
            const projectUrl = params.documentUri ? params.documentUri : rootPath;
            const res = await langClient.getProjectStructure(projectUrl);
            resolve(res);
        });
    }

    async getProjectDetails(): Promise<ProjectDetailsResponse> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;
            const res = await langClient.getProjectDetails();
            resolve(res);
        });
    }

    async updateDependencies(params: UpdateDependenciesRequest): Promise<boolean> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;

            const projectDetails = await langClient.getProjectDetails();
            const existingDependencies = projectDetails.dependencies || [];

            const updatedDependencies: any[] = [];
            const removedDependencies: any[] = [];

            params.dependencies.forEach(dep => {
                const dependenciesToCheck = dep.type === 'zip' ? existingDependencies.connectorDependencies : existingDependencies.otherDependencies;
                let alreadyAvailable = false;
                dependenciesToCheck.forEach(existingDep => {
                    if (existingDep.groupId === dep.groupId &&
                        existingDep.artifact === dep.artifact) {
                        if (existingDep.version !== dep.version) {
                            removedDependencies.push(existingDep);
                        } else {
                            alreadyAvailable = true;
                        }
                        return;
                    }
                });

                !alreadyAvailable && updatedDependencies.push(dep);
            });

            if (updatedDependencies.length > 0) {
                const res = await langClient.updateDependencies({ dependencies: updatedDependencies });
                await this.updatePom(res.textEdits);
            }

            if (removedDependencies.length > 0) {
                await this.updatePomValues({
                    pomValues: removedDependencies.map(dep => ({ range: dep.range, value: '' }))
                });
            }

            resolve(true);
        });
    }

    async updatePomValues(params: UpdatePomValuesRequest): Promise<boolean> {
        return new Promise(async (resolve) => {
            const textEdits = params.pomValues.map((pomValue) => {
                return {
                    newText: pomValue.value,
                    range: pomValue.range! as Range
                };

            });
            await this.updatePom(textEdits);
            resolve(true);
        });
    }

    async updateConfigFileValues(params: UpdateConfigValuesRequest): Promise<boolean> {
        return new Promise(async (resolve) => {
            const projectRoom = StateMachine.context().projectUri!;
            const configFilePath = [projectRoom, 'src', 'main', 'wso2mi', 'resources', 'conf', 'config.properties'].join(path.sep);
            const configDir = path.dirname(configFilePath);
            if (!fs.existsSync(configDir)) {
                // Create the directory structure for the config file if it doesn't exist
                fs.mkdirSync(configDir, { recursive: true });
            }

            // Create config.properties if it doesn't exist
            if (!fs.existsSync(configFilePath)) {
                fs.writeFileSync(configFilePath, "");
            }

            const content = params.configValues.map(configValue => `${configValue.key}:${configValue.value}`).join('\n');
            fs.writeFileSync(configFilePath, content);
            navigate();

            resolve(true);
        });
    }

    async updateConnectorDependencies(): Promise<string> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;
            const res = await langClient.updateConnectorDependencies();
            resolve(res);
        });
    }

    async updateDependenciesFromOverview(params: UpdateDependenciesRequest): Promise<boolean> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;
            const res = await langClient.updateDependencies({ dependencies: params.dependencies });
            await this.updatePom(res.textEdits);
            resolve(true);
        });
    }

    openView(params: OpenViewRequest): void {
        if (params.isPopup) {
            const view = params.location.view;

            if (view && view === MACHINE_VIEW.Overview) {
                openPopupView(POPUP_EVENT_TYPE.CLOSE_VIEW, params.location as PopupVisualizerLocation);
            } else {
                openPopupView(params.type as POPUP_EVENT_TYPE, params.location as PopupVisualizerLocation);
            }
        } else {
            openView(params.type as EVENT_TYPE, params.location as VisualizerLocation);
        }
    }

    goBack(): void {
        if (!StateMachine.context().view?.includes("Form")) {
            const entry = history.pop();
            navigate(entry);
        } else {
            navigate();
        }
    }

    async fetchSamplesFromGithub(): Promise<GettingStartedData> {
        return new Promise(async (resolve) => {
            const url = 'https://mi-connectors.wso2.com/samples/info.json';
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const samples = JSON.parse(JSON.stringify(data)).Samples;
                const categories = JSON.parse(JSON.stringify(data)).categories;

                let categoriesList: GettingStartedCategory[] = [];
                for (let i = 0; i < categories.length; i++) {
                    const cat: GettingStartedCategory = {
                        id: categories[i][0],
                        title: categories[i][1],
                        icon: categories[i][2]
                    };
                    categoriesList.push(cat);
                }
                let sampleList: GettingStartedSample[] = [];
                for (let i = 0; i < samples.length; i++) {
                    const sample: GettingStartedSample = {
                        category: samples[i][0],
                        priority: samples[i][1],
                        title: samples[i][2],
                        description: samples[i][3],
                        zipFileName: samples[i][4],
                        isAvailable: samples[i][5]
                    };
                    sampleList.push(sample);
                }
                const gettingStartedData: GettingStartedData = {
                    categories: categoriesList,
                    samples: sampleList
                };
                resolve(gettingStartedData);

            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    downloadSelectedSampleFromGithub(params: SampleDownloadRequest): void {
        const url = 'https://mi-connectors.wso2.com/samples/samples/';
        handleOpenFile(params.zipFileName, url);
    }

    async addConfigurable(params: AddConfigurableRequest): Promise<void> {
        const projectUri = vscode.workspace.workspaceFolders![0].uri.fsPath;
        const configPropertiesFilePath = [projectUri, 'src', 'main', 'wso2mi', 'resources', 'conf', 'config.properties'].join(path.sep);
        const envFilePath = [projectUri, '.env'].join(path.sep);
        await appendContent(configPropertiesFilePath, `${params.configurableName}:${params.configurableType}\n`);
        await appendContent(envFilePath, `${params.configurableName}\n`);
    }

    async getHistory(): Promise<HistoryEntryResponse> {
        return new Promise(async (resolve) => {
            const res = history.get();
            resolve({ history: res });
        });
    }

    goHome(): void {
        history.clear();
        navigate();
    }

    goSelected(index: number): void {
        history.select(index);
        navigate();
    }

    addToHistory(entry: HistoryEntry): void {
        history.push(entry);
        navigate();
    }

    async getCurrentThemeKind(): Promise<ColorThemeKind> {
        return new Promise((resolve) => {
            const currentThemeKind = window.activeColorTheme.kind;
            resolve(currentThemeKind);
        });
    }

    async toggleDisplayOverview(params: ToggleDisplayOverviewRequest): Promise<void> {
        return new Promise(async (resolve) => {
            await extension.context.workspaceState.update('displayOverview', params.displayOverview);
            resolve();
        });
    }

    goToSource(params: GoToSourceRequest): void {
        goToSource(params.filePath, params.position);
    }

    reloadWindow(): Promise<void> {
        return new Promise(async (resolve) => {
            await commands.executeCommand('workbench.action.reloadWindow');
            resolve();
        });
    }

    focusOutput(): void {
        // Focus on the output channel
        outputChannel.show();
    }

    log(params: LogRequest): void {
        // Logs the message to the output channel
        log(params.message);
    }

    async updateContext(params: UpdateContextRequest): Promise<void> {
        return new Promise(async (resolve) => {
            const { key, value, contextType = "global" } = params;
            if (contextType === "workspace") {
                await extension.context.workspaceState.update(key, value);
            } else {
                await extension.context.globalState.update(key, value);
            }
            resolve();
        });
    }

    async retrieveContext(params: RetrieveContextRequest): Promise<RetrieveContextResponse> {
        return new Promise((resolve) => {
            const { key, contextType = "global" } = params;
            const value = contextType === "workspace" ?
                extension.context.workspaceState.get(key) :
                extension.context.globalState.get(key);
            resolve({ value });
        });
    }

    async showNotification(params: NotificationRequest): Promise<NotificationResponse> {
        return new Promise(async (resolve) => {
            const { message, options, type = "info" } = params;
            let selection: string | undefined;
            if (type === "info") {
                selection = await window.showInformationMessage(message, ...options ?? []);
            } else if (type === "warning") {
                selection = await window.showWarningMessage(message, ...options ?? []);
            } else {
                selection = await window.showErrorMessage(message, ...options ?? []);
            }

            resolve({ selection });
        });
    }

    async getAvailableRuntimeServices(): Promise<RuntimeServicesResponse> {
        return new Promise(async (resolve) => {
            const username = DebuggerConfig.getManagementUserName();
            const password = DebuggerConfig.getManagementPassword();

            const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
            const authHeader = `Basic ${token}`;
            // Create an HTTPS agent that ignores SSL certificate verification
            // MI has ignored the verification for management api, check on this
            const agent = new https.Agent({ rejectUnauthorized: false });

            const runtimeServicesResponse: RuntimeServicesResponse = {
                api: undefined,
                proxy: undefined,
                dataServices: undefined
            };

            const managementPort = DebuggerConfig.getManagementPort();
            const host = DebuggerConfig.getHost();

            const response = await fetch(`https://${host}:${managementPort}/management/login`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`,
                },
                agent: agent // Pass the custom agent
            });

            if (response.ok) {
                const responseBody = await response.json();
                const authToken = responseBody.AccessToken;

                const apiResponse = await fetch(`https://${host}:${managementPort}/management/apis`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    agent: agent // Pass the custom agent
                });

                if (apiResponse.ok) {
                    const apiResponseData = await apiResponse.json();
                    runtimeServicesResponse.api = apiResponseData;
                }


                // get the proxy details
                const proxyResponse = await fetch(`https://${host}:${managementPort}/management/proxy-services`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    agent: agent // Pass the custom agent
                });

                if (proxyResponse.ok) {
                    const proxyResponseData = await proxyResponse.json();
                    runtimeServicesResponse.proxy = proxyResponseData;
                }

                // get the data services details
                const dataServicesResponse = await fetch(`https://${host}:${managementPort}/management/data-services`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    agent: agent // Pass the custom agent
                });

                if (dataServicesResponse.ok) {
                    const dataServicesResponseData = await dataServicesResponse.json();
                    runtimeServicesResponse.dataServices = dataServicesResponseData;
                }

                resolve(runtimeServicesResponse);
            } else {
                log(`Error while login to MI management api: ${response.statusText}`);
                vscode.window.showErrorMessage(`Error while login into the MI Management API: ${response.statusText}`);
            }
        });
    }

    async sendSwaggerProxyRequest(params: SwaggerProxyRequest): Promise<SwaggerProxyResponse> {
        return new Promise(async (resolve) => {
            if (params.command !== 'swaggerRequest') {
                resolve({ isResponse: false });
            } else {
                const swaggerServer: SwaggerServer = new SwaggerServer();
                await swaggerServer.sendRequest(params.request as any, false).then((response) => {
                    if (typeof response === 'boolean') {
                        resolve({ isResponse: true, response: undefined });
                    } else {
                        const responseData: SwaggerProxyResponse = {
                            isResponse: true,
                            response: response
                        };
                        resolve(responseData);
                    }
                });
            }
        });
    }

    async openExternal(params: OpenExternalRequest): Promise<OpenExternalResponse> {
        return new Promise(async (resolve, reject) => {
            const { uri } = params;
            const isSuccess = await env.openExternal(Uri.parse(uri));
            resolve({ success: isSuccess });
        });
    }
    async downloadJavaFromMI(miVersion: string): Promise<string> {
        const javaPath = await downloadJavaFromMI(miVersion);
        return javaPath;
    }
    async downloadMI(params: DownloadMIRequest): Promise<string> {
        const miPath = await downloadMI(params.version, params.isUpdatedPack);
        return miPath;
    }
    async getSupportedMIVersionsHigherThan(miVersion: string): Promise<string[]> {
        return getSupportedMIVersionsHigherThan(miVersion);
    }
    async setPathsInWorkSpace(request: SetPathRequest): Promise<PathDetailsResponse> {
        return await setPathsInWorkSpace(request);
    }

    async selectFolder(title: string): Promise<string | undefined> {
        try {
            const selectedFolder = await selectFolderDialog(title, vscode.Uri.file(os.homedir()));

            if (selectedFolder) {
                const folderPath = selectedFolder.fsPath;
                return folderPath;
            } else {
                vscode.window.showInformationMessage('No folder selected.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error selecting folder: ${error}`);
        }
    }

    async getProjectSetupDetails(): Promise<SetupDetails> {
        return getProjectSetupDetails();
    }
    async updateRuntimeVersionsInPom(version: string): Promise<boolean> {
        try {
            await updateRuntimeVersionsInPom(version);
            return true;
        } catch (e) {
            vscode.window.showErrorMessage('Error updating the runtime versions in the pom.xml file');
            return false;
        }
    }
    async getProjectOverview(params: ProjectStructureRequest): Promise<ProjectOverviewResponse> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;
            const res = await langClient.getOverviewModel();
            resolve(res);
        });
    }

    openReadme(): void {
        const workspaceFolders = workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            window.showErrorMessage("No workspace folder is open.");
            return;
        }

        const projectRoot = workspaceFolders[0].uri.fsPath;
        const readmePath = path.join(projectRoot, "README.md");

        if (!fs.existsSync(readmePath)) {
            // Create README.md if it doesn't exist
            fs.writeFileSync(readmePath, "# Project Overview\n\nAdd your project description here.");
        }

        // Open README.md in the editor
        workspace.openTextDocument(readmePath).then((doc) => {
            window.showTextDocument(doc, ViewColumn.Beside);
        });
    }

    async getReadmeContent(): Promise<ReadmeContentResponse> {
        return new Promise((resolve) => {
            const workspaceFolders = workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                resolve({ content: "" });
                return;
            }

            const projectRoot = workspaceFolders[0].uri.fsPath;
            const readmePath = path.join(projectRoot, "README.md");

            if (!fs.existsSync(readmePath)) {
                resolve({ content: "" });
                return;
            }

            fs.readFile(readmePath, "utf8", (err, data) => {
                if (err) {
                    console.error("Error reading README.md:", err);
                    resolve({ content: "" });
                } else {
                    resolve({ content: data });
                }
            });
        });
    }

    private async updatePom(textEdits: TextEdit[]) {
        const projectRoom = StateMachine.context().projectUri!;
        const pomPath = path.join(projectRoom, 'pom.xml');

        if (!fs.existsSync(pomPath)) {
            throw new Error("pom.xml not found");
        }

        const edit = new WorkspaceEdit();
        for (const textEdit of textEdits) {
            const content = textEdit.newText;

            const range = new Range(new Position(textEdit.range.start.line - 1, textEdit.range.start.character - 1),
                new Position(textEdit.range.end.line - 1, textEdit.range.end.character - 1));

            edit.replace(Uri.file(pomPath), range, content);
        }
        const success = await workspace.applyEdit(edit);
        // Make sure to save the document after applying the edits
        if (success) {
            const document = await workspace.openTextDocument(pomPath);
            await document.save();
        } else {
            throw new Error("Failed to apply edits to pom.xml");
        }
    }

    async importOpenAPISpec(params: ImportOpenAPISpecRequest): Promise<void> {
        const { filePath } = params;
        const langClient = StateMachine.context().langClient!;
        const workspaceFolders = workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace is currently open');
        }
        const workspaceFolder = workspaceFolders[0].uri.fsPath;
        if (filePath && filePath.length > 0) {
            const connectorGenRequest = {
                openAPIPath: filePath,
                connectorProjectPath: path.join(workspaceFolder, 'target')
            };
            const { buildStatus, connectorPath } = await langClient.generateConnector(connectorGenRequest);
            if (buildStatus) {
                await copy(connectorPath, path.join(workspaceFolder, 'src', 'main', 'wso2mi', 'resources', 'connectors', path.basename(connectorPath)));
                vscode.window.showInformationMessage("Connector generated successfully");
            } else {
                vscode.window.showErrorMessage("Error while generating connector");
            }
        }
    }

    async updateLegacyExpressionSupport(value: boolean): Promise<void> {
        const config = workspace.getConfiguration('MI');
        await config.update("LEGACY_EXPRESSION_ENABLED", value, vscode.ConfigurationTarget.Workspace);
    }

    async isLegacyExpressionSupportEnabled(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                const config = workspace.getConfiguration('MI');
                resolve(config.get("LEGACY_EXPRESSION_ENABLED") || false);
            } catch (error) {
                reject(error);
            }
        });
    }
}

