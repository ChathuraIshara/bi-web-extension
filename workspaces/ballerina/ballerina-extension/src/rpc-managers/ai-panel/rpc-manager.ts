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
    AIChatSummary,
    AIPanelAPI,
    AIVisualizerState,
    AI_EVENT_TYPE,
    AddToProjectRequest,
    BIModuleNodesRequest,
    BISourceCodeResponse,
    Command,
    AIPanelPrompt,
    DeleteFromProjectRequest,
    DeveloperDocument,
    DiagnosticEntry,
    Diagnostics,
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
    ProjectModule,
    ProjectSource,
    RequirementSpecification,
    STModification,
    SourceFile,
    SyntaxTree,
    TemplateId,
    TestGenerationMentions,
    TestGenerationRequest,
    TestGenerationResponse
} from "@wso2-enterprise/ballerina-core";
import { STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import path from "path";
import { parse } from 'toml';
import { Uri, commands, window, workspace } from 'vscode';

import { writeFileSync } from "fs";
import { isNumber } from "lodash";
import { URI } from "vscode-uri";
import { extension } from "../../BalExtensionContext";
import { NOT_SUPPORTED } from "../../core";
import { generateDataMapping, generateTypeCreation } from "../../features/ai/dataMapping";
import { generateTest, getDiagnostics, getResourceAccessorDef, getResourceAccessorNames, getServiceDeclaration, getServiceDeclarationNames } from "../../features/ai/testGenerator";
import { BACKEND_URL, closeAllBallerinaFiles } from "../../features/ai/utils";
import { getLLMDiagnosticArrayAsString, handleChatSummaryFailure } from "../../features/natural-programming/utils";
import { StateMachine, updateView } from "../../stateMachine";
import { loginGithubCopilot } from "../../utils/ai/auth";
import { modifyFileContent, writeBallerinaFileDidOpen } from "../../utils/modification";
import { StateMachineAI } from '../../views/ai-panel/aiMachine';
import { PARSING_ERROR, NOT_LOGGED_IN, UNKNOWN_ERROR } from "../../views/ai-panel/errorCodes";
import {
    DEVELOPMENT_DOCUMENT,
    NATURAL_PROGRAMMING_DIR_NAME, REQUIREMENT_DOC_PREFIX,
    REQUIREMENT_MD_DOCUMENT,
    REQUIREMENT_TEXT_DOCUMENT,
    REQ_KEY, TEST_DIR_NAME
} from "./constants";
import { attemptRepairProject, checkProjectDiagnostics } from "./repair-utils";
import { handleLogin, handleStop, isErrorCode, isLoggedin, refreshAccessToken, requirementsSpecification, searchDocumentation } from "./utils";
import { fetchData } from "./utils/fetch-data-utils";

export let hasStopped: boolean = false;

export class AiPanelRpcManager implements AIPanelAPI {

    private testGenAbortController: AbortController | null = null;

    // ==================================
    // General Functions
    // ==================================
    async getBackendUrl(): Promise<string> {
        return new Promise(async (resolve) => {
            resolve(BACKEND_URL);
        });
    }

    async getProjectUuid(): Promise<string> {
        // ADD YOUR IMPLEMENTATION HERE
        return new Promise(async (resolve) => {
            console.log("Implementing getProjectUuid");
            // Check if there is at least one workspace folder
            if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
                console.error("No workspace folder is open.");
                resolve("");
                return;
            }

            // Use the path of the first workspace folder
            const workspaceFolderPath = workspace.workspaceFolders[0].uri.fsPath;

            // Create a hash of the workspace folder path
            const hash = crypto.createHash('sha256');
            hash.update(workspaceFolderPath);
            const hashedWorkspaceFolderPath = hash.digest('hex');

            console.log("Workspace folder path hashed successfully.");
            resolve(hashedWorkspaceFolderPath);
        });
    }

    async getAccessToken(): Promise<string> {
        // return new Promise(async (resolve) => {
        //     resolve(StateMachineAI.context().token as string);
        // });
        return new Promise(async (resolve) => {
            const token = await extension.context.secrets.get('BallerinaAIUser');
            resolve(token as string);
        });
    }

    async getRefreshToken(): Promise<string> {
        return new Promise(async (resolve) => {
            const token = await refreshAccessToken();
            resolve(token);
        });
    }

    async getDefaultPrompt(): Promise<AIPanelPrompt> {
        const defaultPrompt = extension.aiChatDefaultPrompt;
        return new Promise((resolve) => {
            resolve(defaultPrompt);
        });
    }

    async login(): Promise<void> {
        StateMachineAI.service().send(AI_EVENT_TYPE.LOGIN);
    }

    async logout(): Promise<void> {
        StateMachineAI.service().send(AI_EVENT_TYPE.LOGOUT);
    }

    async getAIVisualizerState(): Promise<AIVisualizerState> {
        // ADD YOUR IMPLEMENTATION HERE
        throw new Error('Not implemented');
    }

    async getAiPanelState(): Promise<AIVisualizerState> {
        return { state: StateMachineAI.state() };
    }

    async fetchData(params: FetchDataRequest): Promise<FetchDataResponse> {
        return {
            response: await fetchData(params.url, params.options)
        };
    }

    async addToProject(req: AddToProjectRequest): Promise<void> {

        const workspaceFolders = workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error("No workspaces found.");
        }

        const workspaceFolderPath = workspaceFolders[0].uri.fsPath;
        // Check if workspaceFolderPath is a Ballerina project
        // Assuming a Ballerina project must contain a 'Ballerina.toml' file
        const ballerinaProjectFile = path.join(workspaceFolderPath, 'Ballerina.toml');
        if (!fs.existsSync(ballerinaProjectFile)) {
            throw new Error("Not a Ballerina project.");
        }

        let balFilePath = path.join(workspaceFolderPath, req.filePath);

        const directory = path.dirname(balFilePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        writeBallerinaFileDidOpen(balFilePath, req.content);
        updateView();
    }

    async getFromFile(req: GetFromFileRequest): Promise<string> {
        return new Promise(async (resolve) => {
            const workspaceFolders = workspace.workspaceFolders;
            if (!workspaceFolders) {
                throw new Error("No workspaces found.");
            }

            const workspaceFolderPath = workspaceFolders[0].uri.fsPath;
            const ballerinaProjectFile = path.join(workspaceFolderPath, 'Ballerina.toml');
            if (!fs.existsSync(ballerinaProjectFile)) {
                throw new Error("Not a Ballerina project.");
            }

            const balFilePath = path.join(workspaceFolderPath, req.filePath);
            const content = fs.promises.readFile(balFilePath, 'utf-8');
            resolve(content);
        });
    }

    async deleteFromProject(req: DeleteFromProjectRequest): Promise<void> {
        const workspaceFolders = workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error("No workspaces found.");
        }

        const workspaceFolderPath = workspaceFolders[0].uri.fsPath;
        const ballerinaProjectFile = path.join(workspaceFolderPath, 'Ballerina.toml');
        if (!fs.existsSync(ballerinaProjectFile)) {
            throw new Error("Not a Ballerina project.");
        }

        const balFilePath = path.join(workspaceFolderPath, req.filePath);
        if (fs.existsSync(balFilePath)) {
            try {
                fs.unlinkSync(balFilePath);
            } catch (err) {
                throw new Error("Could not delete the file.");
            }
        } else {
            throw new Error("File does not exist.");
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        updateView();
    }

    async getFileExists(req: GetFromFileRequest): Promise<boolean> {
        const workspaceFolders = workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error("No workspaces found.");
        }

        const workspaceFolderPath = workspaceFolders[0].uri.fsPath;
        const ballerinaProjectFile = path.join(workspaceFolderPath, 'Ballerina.toml');
        if (!fs.existsSync(ballerinaProjectFile)) {
            throw new Error("Not a Ballerina project.");
        }

        const balFilePath = path.join(workspaceFolderPath, req.filePath);
        if (fs.existsSync(balFilePath)) {
            return true;
        }
        return false;
    }

    async generateMappings(params: GenerateMappingsRequest): Promise<GenerateMappingsResponse> {
        const logged = await isLoggedin();

        if (!logged) {
            await handleLogin();
            return { error: NOT_LOGGED_IN };
        }

        let { filePath, position } = params;

        const fileUri = Uri.file(filePath).toString();
        hasStopped = false;

        const fnSTByRange = await StateMachine.langClient().getSTByRange(
            {
                lineRange: {
                    start: {
                        line: position.startLine,
                        character: position.startColumn
                    },
                    end: {
                        line: position.endLine,
                        character: position.endColumn
                    }
                },
                documentIdentifier: {
                    uri: fileUri
                }
            }
        );

        if (fnSTByRange === NOT_SUPPORTED) {
            return { error: UNKNOWN_ERROR };
        }

        const {
            parseSuccess: fnSTByRangeParseSuccess,
            syntaxTree: fnSTByRangeSyntaxTree,
            source: oldSource
        } = fnSTByRange as SyntaxTree;
        const fnSt = fnSTByRangeSyntaxTree as STNode;

        if (!fnSTByRangeParseSuccess || !STKindChecker.isFunctionDefinition(fnSt)) {
            return { error: PARSING_ERROR };
        }

        const functionName = fnSt.functionName?.value || "";

        commands.executeCommand("ballerina.close.ai.panel");
        commands.executeCommand("ballerina.open.ai.panel", {
            type: 'command-template',
            command: Command.DataMap,
            templateId: TemplateId.MappingsForFunction,
            params: {
                functionName: functionName
            }
        });
    }

    async notifyAIMappings(params: NotifyAIMappingsRequest): Promise<boolean> {
        const { newFnPosition, prevFnSource, filePath } = params;
        const fileUri = Uri.file(filePath).toString();
        const undoAction = 'Undo';
        const msg = 'You have automatically generated mappings. Do you want to undo the changes?';
        const result = await window.showInformationMessage(msg, undoAction, 'Close');

        if (result === undoAction) {
            const res = await StateMachine.langClient().stModify({
                astModifications: [{
                    type: "INSERT",
                    config: { STATEMENT: prevFnSource },
                    ...newFnPosition
                }],
                documentIdentifier: {
                    uri: fileUri
                }
            });

            const { source } = res as SyntaxTree;
            modifyFileContent({ filePath, content: source });
            updateView();
        }

        return true;
    }

    async stopAIMappings(): Promise<GenerateMappingsResponse> {
        hasStopped = true;
        handleStop();
        return { userAborted: true };
    }

    async promptLogin(): Promise<boolean> {
        await handleLogin();
        return true;
    }

    async getProjectSource(requestType: string): Promise<ProjectSource> {
        // Fetch the Ballerina project source
        const project: BallerinaProject = await getCurrentProjectSource(requestType);

        // Initialize the ProjectSource object
        const projectSource: ProjectSource = {
            sourceFiles: [],
            projectModules: [],
            projectName: project.projectName,
        };

        // Iterate through root-level sources
        for (const [filePath, content] of Object.entries(project.sources)) {
            projectSource.sourceFiles.push({ filePath, content });
        }

        // Iterate through module sources
        if (project.modules) {
            for (const module of project.modules) {
                const projectModule: ProjectModule = {
                    moduleName: module.moduleName,
                    sourceFiles: [],
                    isGenerated: module.isGenerated
                };
                for (const [fileName, content] of Object.entries(module.sources)) {
                    // const filePath = `modules/${module.moduleName}/${fileName}`;
                    // projectSource.sourceFiles.push({ filePath, content });
                    projectModule.sourceFiles.push({ filePath: fileName, content });
                }
                projectSource.projectModules.push(projectModule);
            }
        }

        return projectSource;
    }

    async getShadowDiagnostics(project: ProjectSource): Promise<ProjectDiagnostics> {
        const environment = await setupProjectEnvironment(project);
        if (!environment) {
            return { diagnostics: [] };
        }

        const { langClient, tempDir } = environment;
        let remainingDiags: Diagnostics[] = await attemptRepairProject(langClient, tempDir);
        const filteredDiags: DiagnosticEntry[] = getErrorDiagnostics(remainingDiags);
        await closeAllBallerinaFiles(tempDir);
        return {
            diagnostics: filteredDiags
        };
    }

    async clearInitialPrompt(): Promise<void> {
        extension.aiChatDefaultPrompt = undefined;
    }

    async checkSyntaxError(project: ProjectSource): Promise<boolean> {
        const environment = await setupProjectEnvironment(project);
        if (!environment) {
            return false;
        }

        const { langClient, tempDir } = environment;
        // check project diagnostics
        const projectDiags: Diagnostics[] = await checkProjectDiagnostics(langClient, tempDir);
        await closeAllBallerinaFiles(tempDir);
        for (const diagnostic of projectDiags) {
            for (const diag of diagnostic.diagnostics) {
                console.log(diag.code);
                if (typeof diag.code === "string" && diag.code.startsWith("BCE")) {
                    const match = diag.code.match(/^BCE(\d+)$/);
                    if (match) {
                        const codeNumber = Number(match[1]);
                        if (codeNumber < 2000) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    async getGeneratedTests(params: TestGenerationRequest): Promise<TestGenerationResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const projectRoot = await getBallerinaProjectRoot();

                if (this.testGenAbortController) {
                    this.testGenAbortController.abort();
                }
                this.testGenAbortController = new AbortController();
                const generatedTests = await generateTest(projectRoot, params, this.testGenAbortController);
                resolve(generatedTests);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getTestDiagnostics(params: TestGenerationResponse): Promise<ProjectDiagnostics> {
        return new Promise(async (resolve, reject) => {
            try {
                const projectRoot = await getBallerinaProjectRoot();
                const diagnostics = await getDiagnostics(projectRoot, params);
                resolve(diagnostics);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getServiceSourceForName(params: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const projectRoot = await getBallerinaProjectRoot();
                const { serviceDeclaration, serviceDocFilePath } = await getServiceDeclaration(projectRoot, params);
                resolve(serviceDeclaration.source);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getResourceSourceForMethodAndPath(params: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const projectRoot = await getBallerinaProjectRoot();
                const { serviceDeclaration, resourceAccessorDef, serviceDocFilePath } = await getResourceAccessorDef(projectRoot, params);
                resolve(resourceAccessorDef.source);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getServiceNames(): Promise<TestGenerationMentions> {
        return new Promise(async (resolve, reject) => {
            try {
                const projectRoot = await getBallerinaProjectRoot();
                const serviceDeclNames = await getServiceDeclarationNames(projectRoot);
                resolve({
                    mentions: serviceDeclNames
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async getResourceMethodAndPaths(): Promise<TestGenerationMentions> {
        return new Promise(async (resolve, reject) => {
            try {
                const projectRoot = await getBallerinaProjectRoot();
                const resourceAccessorNames = await getResourceAccessorNames(projectRoot);
                resolve({
                    mentions: resourceAccessorNames
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async abortTestGeneration(): Promise<void> {
        if (this.testGenAbortController) {
            this.testGenAbortController.abort();
            this.testGenAbortController = null;
        }
    }

    async getMappingsFromRecord(params: GenerateMappingsFromRecordRequest): Promise<GenerateMappingFromRecordResponse> {
        const projectRoot = await getBallerinaProjectRoot();
        return await generateDataMapping(projectRoot, params);
    }

    async getTypesFromRecord(params: GenerateTypesFromRecordRequest): Promise<GenerateTypesFromRecordResponse> {
        const projectRoot = await getBallerinaProjectRoot();
        return await generateTypeCreation(projectRoot, params);
    }

    async postProcess(req: PostProcessRequest): Promise<PostProcessResponse> {
        let assist_resp = req.assistant_response;
        assist_resp = assist_resp.replace(/import ballerinax\/client\.config/g, "import ballerinax/'client.config");
        const project: ProjectSource = getProjectFromResponse(assist_resp);
        const environment = await setupProjectEnvironment(project);
        if (!environment) {
            return { assistant_response: assist_resp, diagnostics: { diagnostics: [] } };
        }

        const { langClient, tempDir } = environment;
        // check project diagnostics
        let remainingDiags: Diagnostics[] = await attemptRepairProject(langClient, tempDir);

        const filteredDiags: DiagnosticEntry[] = getErrorDiagnostics(remainingDiags);
        const newAssistantResponse = getModifiedAssistantResponse(assist_resp, tempDir, project);
        await closeAllBallerinaFiles(tempDir);
        return {
            assistant_response: newAssistantResponse,
            diagnostics: {
                diagnostics: filteredDiags
            }
        };
    }

    async applyDoOnFailBlocks(): Promise<void> {
        const projectRoot = await getBallerinaProjectRoot();

        if (!projectRoot) {
            return null;
        }

        const balFiles: string[] = [];

        const findBalFiles = (dir: string) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    findBalFiles(filePath);
                } else if (file.endsWith('.bal')) {
                    balFiles.push(filePath);
                }
            }
        };

        findBalFiles(projectRoot);

        for (const balFile of balFiles) {
            const req: BIModuleNodesRequest = {
                filePath: balFile
            };

            const resp: BISourceCodeResponse = await StateMachine.langClient().addErrorHandler(req);
            await this.updateSource(resp, false);
        }
    }

    // TODO: Reuse the one in bi-diagram
    async updateSource(
        params: BISourceCodeResponse,
        isConnector?: boolean,
        isDataMapperFormUpdate?: boolean
    ): Promise<void> {
        const modificationRequests: Record<string, { filePath: string; modifications: STModification[] }> = {};

        for (const [key, value] of Object.entries(params.textEdits)) {
            const fileUri = Uri.parse(key);
            const fileUriString = fileUri.toString();
            const edits = value;

            if (edits && edits.length > 0) {
                const modificationList: STModification[] = [];

                for (const edit of edits) {
                    const stModification: STModification = {
                        startLine: edit.range.start.line,
                        startColumn: edit.range.start.character,
                        endLine: edit.range.end.line,
                        endColumn: edit.range.end.character,
                        type: "INSERT",
                        isImport: false,
                        config: {
                            STATEMENT: edit.newText,
                        },
                    };
                    modificationList.push(stModification);
                }

                if (modificationRequests[fileUriString]) {
                    modificationRequests[fileUriString].modifications.push(...modificationList);
                } else {
                    modificationRequests[fileUriString] = { filePath: fileUri.fsPath, modifications: modificationList };
                }
            }
        }

        // Iterate through modificationRequests and apply modifications
        for (const [fileUriString, request] of Object.entries(modificationRequests)) {
            const { parseSuccess, source, syntaxTree } = (await StateMachine.langClient().stModify({
                documentIdentifier: { uri: fileUriString },
                astModifications: request.modifications,
            })) as SyntaxTree;

            if (parseSuccess) {
                writeFileSync(request.filePath, source);
                await StateMachine.langClient().didChange({
                    textDocument: { uri: fileUriString, version: 1 },
                    contentChanges: [
                        {
                            text: source,
                        },
                    ],
                });

                if (isConnector) {
                    await StateMachine.langClient().resolveMissingDependencies({
                        documentIdentifier: { uri: fileUriString },
                    });
                    // Temp fix: ResolveMissingDependencies does not work uless we call didOpen, This needs to be fixed in the LS
                    await StateMachine.langClient().didOpen({
                        textDocument: { uri: fileUriString, languageId: "ballerina", version: 1, text: source },
                    });
                }
            }
        }
        if (!isConnector && !isDataMapperFormUpdate) {
            updateView();
        }
    }

    async getActiveFile(): Promise<string> {
        const activeTabGroup = window.tabGroups.all.find(group => {
            return group.activeTab.isActive && group.activeTab?.input;
        });

        if (activeTabGroup && activeTabGroup.activeTab && activeTabGroup.activeTab.input) {
            const activeTabInput = activeTabGroup.activeTab.input as { uri: { fsPath: string } };

            if (activeTabInput.uri) {
                const fileUri = activeTabInput.uri;
                const fileName = fileUri.fsPath.split('/').pop();
                return fileName || '';
            }
        }
    }

    async getFromDocumentation(content: string): Promise<string> {
        const response = await searchDocumentation(content);
        return response.toString();
    }

    async openSettings(): Promise<void> {
        StateMachineAI.service().send(AI_EVENT_TYPE.SETUP);
    }

    async openChat(): Promise<void> {
        StateMachineAI.service().send(AI_EVENT_TYPE.CHAT);
    }

    async promptGithubAuthorize(): Promise<boolean> {
        return await loginGithubCopilot();
        //Change state to notify?
        // return true;
    }

    async promptWSO2AILogout(): Promise<boolean> {
        // ADD YOUR IMPLEMENTATION HERE
        throw new Error('Not implemented');
    }

    async isCopilotSignedIn(): Promise<boolean> {
        const token = await extension.context.secrets.get('GITHUB_COPILOT_TOKEN');
        if (token && token !== '') {
            return true;
        }
        return false;
    }

    async isWSO2AISignedIn(): Promise<boolean> {
        const token = await extension.context.secrets.get('BallerinaAIUser');
        if (token && token !== '') {
            return true;
        }
        return false;
    }

    async showSignInAlert(): Promise<boolean> {
        const resp = await extension.context.secrets.get('LOGIN_ALERT_SHOWN');
        if (resp === 'true') {
            return false;
        }
        const isWso2Signed = await this.isWSO2AISignedIn();

        if (isWso2Signed) {
            return false;
        }
        return true;
    }

    async markAlertShown(): Promise<void> {
        await extension.context.secrets.store('LOGIN_ALERT_SHOWN', 'true');
    }

    async isRequirementsSpecificationFileExist(filePath: string): Promise<boolean> {
        const dirPath = path.join(filePath, NATURAL_PROGRAMMING_DIR_NAME);

        if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
            return false; // Directory doesn't exist or isn't a folder
        }

        const files = fs.readdirSync(dirPath);
        return Promise.resolve(files.some(file => file.toLowerCase().startsWith(REQUIREMENT_DOC_PREFIX)));
    }

    async addChatSummary(filepathAndSummary: AIChatSummary): Promise<boolean> {
        const filepath = filepathAndSummary.filepath;
        var summaryResponse = filepathAndSummary.summary;

        const summaryJson: SummaryResponse = JSON.parse(summaryResponse);
        let summary = summaryJson.summary;

        const naturalProgrammingDirectory = path.join(filepath, NATURAL_PROGRAMMING_DIR_NAME);

        if (!fs.existsSync(naturalProgrammingDirectory)) {
            return false;
        }

        const developerMdPath = path.join(naturalProgrammingDirectory, DEVELOPMENT_DOCUMENT);
        fs.writeFileSync(developerMdPath, summary, 'utf8');
        return true;
    }

    async readDeveloperMdFile(directoryPath: string): Promise<string> {
        const developerMdPath = path.join(directoryPath, NATURAL_PROGRAMMING_DIR_NAME, DEVELOPMENT_DOCUMENT);
        if (!fs.existsSync(developerMdPath)) {
            return "";
        }

        let developerMdContent = fs.readFileSync(developerMdPath, 'utf8');
        return Promise.resolve(developerMdContent);
    }

    async updateDevelopmentDocument(developerDocument: DeveloperDocument) {
        const projectPath = developerDocument.filepath;
        const content = developerDocument.content;

        const developerMdPath = path.join(projectPath, NATURAL_PROGRAMMING_DIR_NAME, DEVELOPMENT_DOCUMENT);
        if (fs.existsSync(developerMdPath)) {
            fs.writeFileSync(developerMdPath, content, 'utf8');
        }
    }

    async updateRequirementSpecification(requirementsSpecification: RequirementSpecification) {
        const naturalProgrammingDir = path.join(requirementsSpecification.filepath, 'natural-programming');
        const requirementsFilePath = path.join(naturalProgrammingDir, 'requirements.txt');

        // Create the 'natural-programming' directory if it doesn't exist
        if (!fs.existsSync(naturalProgrammingDir)) {
            fs.mkdirSync(naturalProgrammingDir, { recursive: true });
        }

        // Write the requirements to the 'requirements.txt' file
        fs.writeFileSync(requirementsFilePath, requirementsSpecification.content, 'utf8');
    }

    async getDriftDiagnosticContents(projectPath: string): Promise<LLMDiagnostics> {
        const result = await getLLMDiagnosticArrayAsString(projectPath);
        if (isNumber(result)) {
            return {
                statusCode: result,
                diags: "Failed to check drift between the code and the documentation. Please try again."
            };
        }

        return {
            statusCode: 200,
            diags: result
        };
    }

    async createTestDirecoryIfNotExists(directoryPath: string) {
        const testDirName = path.join(directoryPath, TEST_DIR_NAME);
        if (!fs.existsSync(testDirName)) {
            fs.mkdirSync(testDirName, { recursive: true }); // Add recursive: true
        }
    }

    async getThemeKind(): Promise<string> {
        return new Promise((resolve) => {
            const themeKind = window.activeColorTheme.kind;
            switch (themeKind) {
                case 1:
                case 4:
                    resolve("light");
                    break;
                default:
                    resolve("dark");
                    break;
            }
        });
    }

    async handleChatSummaryError(message: string): Promise<void> {
        return handleChatSummaryFailure(message);
    }

    async isNaturalProgrammingDirectoryExists(projectPath: string): Promise<boolean> {
        const dirPath = path.join(projectPath, NATURAL_PROGRAMMING_DIR_NAME);
        if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
            return false; // Directory doesn't exist or isn't a folder
        }
        return true;
    }

    async getModuleDirectory(params: GetModuleDirParams): Promise<string> {
        return new Promise((resolve) => {
            const projectUri = params.filePath;
            const projectFsPath = URI.parse(projectUri).fsPath;
            const moduleName = params.moduleName;
            const generatedPath = path.join(projectFsPath, "generated", moduleName);
            if (fs.existsSync(generatedPath) && fs.statSync(generatedPath).isDirectory()) {
                resolve("generated");
            } else {
                resolve("modules");
            }
        });
    }

    async getContentFromFile(content: GetFromFileRequest): Promise<string> {
        return new Promise(async (resolve) => {
            const projectFsPath = URI.parse(content.filePath).fsPath;
            const fileContent = fs.promises.readFile(projectFsPath, 'utf-8');
            resolve(fileContent);
        });
    }
}

function getModifiedAssistantResponse(originalAssistantResponse: string, tempDir: string, project: ProjectSource): string {
    const newSourceFiles = [];
    for (const sourceFile of project.sourceFiles) {
        const newContent = path.join(tempDir, sourceFile.filePath);
        newSourceFiles.push({ filePath: sourceFile.filePath, content: fs.readFileSync(newContent, 'utf-8') });
    }

    // Build a map from filenames to their new content
    const fileContentMap = new Map<string, string>();
    for (const sourceFile of newSourceFiles) {
        fileContentMap.set(sourceFile.filePath, sourceFile.content);
    }

    // Replace code blocks in originalAssistantResponse with new content
    const modifiedResponse = originalAssistantResponse.replace(
        /<code filename="([^"]+)">\s*```ballerina([\s\S]*?)```[\s\S]*?<\/code>/g,
        (match, filename) => {
            if (fileContentMap.has(filename)) {
                const newContent = fileContentMap.get(filename);
                return `<code filename="${filename}">\n\`\`\`ballerina\n${newContent}\n\`\`\`\n</code>`;
            } else {
                // If no new content, keep the original
                return match;
            }
        }
    );

    return modifiedResponse;
}

interface SummaryResponse {
    summary: string;
}

interface BalModification {
    fileUri: string;
    moduleName: string;
}

async function setupProjectEnvironment(project: ProjectSource): Promise<{ langClient: any, tempDir: string } | null> {
    //TODO: Move this to LS
    const projectRoot = await getBallerinaProjectRoot();
    if (!projectRoot) {
        return null;
    }

    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `bal-proj-${randomNum}-`));
    fs.cpSync(projectRoot, tempDir, { recursive: true });
    //Copy project
    const langClient = StateMachine.langClient();
    //Apply edits
    for (const sourceFile of project.sourceFiles) {
        // Update lastUpdatedBalFile if it's a .bal file
        if (sourceFile.filePath.endsWith('.bal')) {
            const tempFilePath = path.join(tempDir, sourceFile.filePath);
            writeBallerinaFileDidOpen(tempFilePath, sourceFile.content);
        }
    }

    return { langClient, tempDir };
}

export function getProjectFromResponse(req: string): ProjectSource {
    const sourceFiles: SourceFile[] = [];
    const regex = /<code filename="([^"]+)">\s*```ballerina([\s\S]*?)```\s*<\/code>/g;
    let match;

    while ((match = regex.exec(req)) !== null) {
        const filePath = match[1];
        const fileContent = match[2].trim();
        sourceFiles.push({ filePath, content: fileContent });
    }

    return { sourceFiles, projectName: "" };
}

function getContentInsideQuotes(input: string): string | null {
    const match = input.match(/'([^']+)'/);
    return match ? match[1] : null;
}

function getErrorDiagnostics(diagnostics: Diagnostics[]): DiagnosticEntry[] {
    const errorDiagnostics: DiagnosticEntry[] = [];

    for (const diagParam of diagnostics) {
        for (const diag of diagParam.diagnostics) {
            if (diag.severity === 1) {
                const fileName = path.basename(diagParam.uri);
                const msgPrefix = `[${fileName}:${diag.range.start.line},${diag.range.start.character}:${diag.range.end.line},${diag.range.end.character}] `;
                errorDiagnostics.push({
                    message: msgPrefix + diag.message
                });
            }
        }
    }

    return errorDiagnostics;
}

interface BallerinaProject {
    projectName: string;
    modules?: BallerinaModule[];
    sources: { [key: string]: string };
}

interface BallerinaModule {
    moduleName: string;
    sources: { [key: string]: string };
    isGenerated: boolean;
}

enum CodeGenerationType {
    CODE_FOR_USER_REQUIREMENT = "CODE_FOR_USER_REQUIREMENT",
    TESTS_FOR_USER_REQUIREMENT = "TESTS_FOR_USER_REQUIREMENT",
    CODE_GENERATION = "CODE_GENERATION"
}

async function getCurrentProjectSource(requestType: string): Promise<BallerinaProject> {
    const projectRoot = await getBallerinaProjectRoot();

    if (!projectRoot) {
        return null;
    }

    // Read the Ballerina.toml file to get package name
    const ballerinaTomlPath = path.join(projectRoot, 'Ballerina.toml');
    let packageName;
    if (fs.existsSync(ballerinaTomlPath)) {
        const tomlContent = await fs.promises.readFile(ballerinaTomlPath, 'utf-8');
        // Simple parsing to extract the package.name field
        try {
            const tomlObj = parse(tomlContent);
            packageName = tomlObj.package.name;
        } catch (error) {
            packageName = '';
        }
    }

    const project: BallerinaProject = {
        modules: [],
        sources: {},
        projectName: packageName
    };

    // Read root-level .bal files
    const rootFiles = fs.readdirSync(projectRoot);
    for (const file of rootFiles) {
        if (file.endsWith('.bal') || file.toLowerCase() === "readme.md") {
            const filePath = path.join(projectRoot, file);
            project.sources[file] = await fs.promises.readFile(filePath, 'utf-8');
        }
    }

    if (requestType != CodeGenerationType.CODE_GENERATION) {
        const naturalProgrammingDirectory = projectRoot + `/${NATURAL_PROGRAMMING_DIR_NAME}`;
        if (fs.existsSync(naturalProgrammingDirectory)) {
            const reqFiles = fs.readdirSync(naturalProgrammingDirectory);
            for (const file of reqFiles) {
                const filePath = path.join(projectRoot, `${NATURAL_PROGRAMMING_DIR_NAME}`, file);
                if (file.toLowerCase() == REQUIREMENT_TEXT_DOCUMENT || file.toLowerCase() == REQUIREMENT_MD_DOCUMENT) {
                    project.sources[REQ_KEY] = await fs.promises.readFile(filePath, 'utf-8');
                    continue;
                } else if (file.toLowerCase().startsWith(REQUIREMENT_DOC_PREFIX)) {
                    const requirements = await requirementsSpecification(filePath);
                    if (!isErrorCode(requirements)) {
                        project.sources[REQ_KEY] = requirements.toString();
                        continue;
                    }
                    project.sources[REQ_KEY] = "";
                }
            }
        }
    }

    // Read modules
    const modulesDir = path.join(projectRoot, 'modules');
    const generatedDir = path.join(projectRoot, 'generated');
    await populateModules(modulesDir, project);
    await populateModules(generatedDir, project);
    return project;
}

async function populateModules(modulesDir: string, project: BallerinaProject) {
    if (fs.existsSync(modulesDir)) {
        const modules = fs.readdirSync(modulesDir, { withFileTypes: true });
        for (const moduleDir of modules) {
            if (moduleDir.isDirectory()) {
                const module: BallerinaModule = {
                    moduleName: moduleDir.name,
                    sources: {},
                    isGenerated: path.basename(modulesDir) !== 'modules'
                };

                const moduleFiles = fs.readdirSync(path.join(modulesDir, moduleDir.name));
                for (const file of moduleFiles) {
                    if (file.endsWith('.bal')) {
                        const filePath = path.join(modulesDir, moduleDir.name, file);
                        module.sources[file] = await fs.promises.readFile(filePath, 'utf-8');
                    }
                }

                project.modules.push(module);
            }
        }
    }
}

async function getBallerinaProjectRoot(): Promise<string | null> {

    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error("No workspaces found.");
    }

    const workspaceFolderPath = workspaceFolders[0].uri.fsPath;
    // Check if workspaceFolderPath is a Ballerina project
    // Assuming a Ballerina project must contain a 'Ballerina.toml' file
    const ballerinaProjectFile = path.join(workspaceFolderPath, 'Ballerina.toml');
    if (fs.existsSync(ballerinaProjectFile)) {
        return workspaceFolderPath;
    }
    return null;
}
