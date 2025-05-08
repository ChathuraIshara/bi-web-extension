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
    ExportOASRequest,
    ExportOASResponse,
    FunctionModelRequest,
    FunctionModelResponse,
    FunctionSourceCodeRequest,
    HttpResourceModelRequest,
    HttpResourceModelResponse,
    ListenerModelFromCodeRequest,
    ListenerModelFromCodeResponse,
    ListenerModelRequest,
    ListenerModelResponse,
    ListenerSourceCodeRequest,
    ListenerSourceCodeResponse,
    ListenersRequest,
    ListenersResponse,
    OpenAPISpec,
    ResourceSourceCodeResponse,
    STModification,
    ServiceDesignerAPI,
    ServiceModelFromCodeRequest,
    ServiceModelFromCodeResponse,
    ServiceModelRequest,
    ServiceModelResponse,
    ServiceSourceCodeRequest,
    SourceUpdateResponse,
    SyntaxTree,
    TriggerModelsRequest,
    TriggerModelsResponse
} from "@wso2-enterprise/ballerina-core";
import { NodePosition } from "@wso2-enterprise/syntax-tree";
import * as fs from 'fs';
import { existsSync, writeFileSync } from "fs";
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as vscode from "vscode";
import { Uri, window, workspace } from "vscode";
import { StateMachine } from "../../stateMachine";
import { extension } from "../../BalExtensionContext";

export class ServiceDesignerRpcManager implements ServiceDesignerAPI {

    async exportOASFile(params: ExportOASRequest): Promise<ExportOASResponse> {
        return new Promise(async (resolve) => {
            const res: ExportOASResponse = { openSpecFile: null };
            const documentFilePath = params.documentFilePath ? params.documentFilePath : StateMachine.context().documentUri;
            const spec = await StateMachine.langClient().convertToOpenAPI({ documentFilePath }) as OpenAPISpec;
            if (spec.content) {
                // Convert the OpenAPI spec to a YAML string
                const yamlStr = yaml.dump(spec.content[0].spec);
                window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, openLabel: 'Select OAS Save Location' })
                    .then(uri => {
                        if (uri && uri[0]) {
                            const projectLocation = uri[0].fsPath;
                            // Construct the correct path for the output file
                            const filePath = path.join(projectLocation, `${spec.content[0]?.serviceName}_openapi.yaml`);

                            // Save the YAML string to the file
                            fs.writeFileSync(filePath, yamlStr, 'utf8');
                            // Set the response
                            res.openSpecFile = filePath;
                            // Open the file in a new VSCode document
                            workspace.openTextDocument(filePath).then(document => {
                                window.showTextDocument(document);
                            });
                        }
                    });
            } else {
                window.showErrorMessage(spec.error);
            }
            resolve(res);
        });
    }

    async getListeners(params: ListenersRequest): Promise<ListenersResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const projectDir = path.join(StateMachine.context().projectUri);
                const targetFile = path.join(projectDir, `main.bal`);
                this.ensureFileExists(targetFile);
                params.filePath = targetFile;
                const res: ListenersResponse = await context.langClient.getListeners(params);
                resolve(res);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async getListenerModel(params: ListenerModelRequest): Promise<ListenerModelResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const res: ListenerModelResponse = await context.langClient.getListenerModel(params);
                resolve(res);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async addListenerSourceCode(params: ListenerSourceCodeRequest): Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const projectDir = path.join(StateMachine.context().projectUri);
                const targetFile = path.join(projectDir, `main.bal`);
                this.ensureFileExists(targetFile);
                params.filePath = targetFile;
                const res: ListenerSourceCodeResponse = await context.langClient.addListenerSourceCode(params);
                const position = await this.updateSource(res);
                const result: SourceUpdateResponse = {
                    filePath: targetFile,
                    position: position
                };
                // Set timeout to resolve after 2 seconds if no notification received
                setTimeout(() => {
                    if (extension.hasPullModuleNotification) {
                        const waitForModuleResolution = new Promise<void>((resolve) => {
                            const checkInterval = setInterval(() => {
                                if (extension.hasPullModuleResolved) {
                                    clearInterval(checkInterval);
                                    resolve();
                                }
                            }, 100);
                        });
                        waitForModuleResolution.then(() => {
                            resolve(result);
                        });
                    } else {
                        resolve(result);
                    }
                }, 1000);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async updateListenerSourceCode(params: ListenerSourceCodeRequest): Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const projectDir = path.join(StateMachine.context().projectUri);
                const targetFile = path.join(projectDir, `main.bal`);
                this.ensureFileExists(targetFile);
                params.filePath = targetFile;
                const res: ListenerSourceCodeResponse = await context.langClient.updateListenerSourceCode(params);
                const position = await this.updateSource(res);
                const result: SourceUpdateResponse = {
                    filePath: targetFile,
                    position: position
                };
                resolve(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async getServiceModel(params: ServiceModelRequest): Promise<ServiceModelResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const projectDir = path.join(StateMachine.context().projectUri);
                const targetFile = path.join(projectDir, `main.bal`);
                this.ensureFileExists(targetFile);
                params.filePath = targetFile;
                const res: ServiceModelResponse = await context.langClient.getServiceModel(params);
                resolve(res);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async addServiceSourceCode(params: ServiceSourceCodeRequest): Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            // Update the state tempData with the service model. This is used to navigate after the source code is updated
            StateMachine.setTempData({
                serviceModel: params.service,
                isNewService: true
            });
            const context = StateMachine.context();
            try {
                const projectDir = path.join(StateMachine.context().projectUri);
                const targetFile = path.join(projectDir, `main.bal`);
                this.ensureFileExists(targetFile);
                params.filePath = targetFile;
                const identifiers = [];
                for (let property in params.service.properties) {
                    const value = params.service.properties[property].value || params.service.properties[property].values?.at(0);
                    if (value) {
                        identifiers.push(value);
                    }
                    if (params.service.properties[property].choices) {
                        params.service.properties[property].choices.forEach(choice => {
                            if (choice.properties) {
                                Object.keys(choice.properties).forEach(subProperty => {
                                    const subPropertyValue = choice.properties[subProperty].value;
                                    if (subPropertyValue) {
                                        identifiers.push(subPropertyValue);
                                    }
                                });
                            }
                        });
                    }
                }
                const res: ListenerSourceCodeResponse = await context.langClient.addServiceSourceCode(params);
                const position = await this.updateSource(res, identifiers);
                let result: SourceUpdateResponse = {
                    filePath: targetFile,
                    position: position
                };
                resolve(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async updateServiceSourceCode(params: ServiceSourceCodeRequest): Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            // Update the state tempData with the service model. This is used to navigate after the source code is updated
            StateMachine.setTempData({
                serviceModel: params.service
            });
            try {
                const projectDir = path.join(StateMachine.context().projectUri);
                const targetFile = path.join(projectDir, `main.bal`);
                this.ensureFileExists(targetFile);
                params.filePath = targetFile;
                const identifiers = [];
                for (let property in params.service.properties) {
                    const value = params.service.properties[property].value || params.service.properties[property].values?.at(0);
                    if (value) {
                        identifiers.push(value);
                    }
                }
                const res: ListenerSourceCodeResponse = await context.langClient.updateServiceSourceCode(params);
                const position = await this.updateSource(res, identifiers);
                const result: SourceUpdateResponse = {
                    filePath: targetFile,
                    position: position
                };
                resolve(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async getServiceModelFromCode(params: ServiceModelFromCodeRequest): Promise<ServiceModelFromCodeResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const res: ServiceModelFromCodeResponse = await context.langClient.getServiceModelFromCode(params);
                resolve(res);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async getHttpResourceModel(params: HttpResourceModelRequest): Promise<HttpResourceModelResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const res: HttpResourceModelResponse = await context.langClient.getHttpResourceModel(params);
                resolve(res);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async addResourceSourceCode(params: FunctionSourceCodeRequest): Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            StateMachine.setTempData({
                serviceModel: params.service
            });
            try {
                const projectDir = path.join(StateMachine.context().projectUri);
                if (!params.filePath) {
                    const targetFile = path.join(projectDir, `main.bal`);
                    this.ensureFileExists(targetFile);
                    params.filePath = targetFile;
                }
                const targetPosition: NodePosition = {
                    startLine: params.codedata.lineRange.startLine.line,
                    startColumn: params.codedata.lineRange.startLine.offset
                };
                const res: ResourceSourceCodeResponse = await context.langClient.addResourceSourceCode(params);
                const position = await this.updateSource(res, undefined, targetPosition);
                const result: SourceUpdateResponse = {
                    filePath: params.filePath,
                    position: position
                };
                resolve(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async updateResourceSourceCode(params: FunctionSourceCodeRequest): Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            StateMachine.setTempData({
                serviceModel: params.service
            });
            try {
                const targetPosition: NodePosition = {
                    startLine: params.codedata.lineRange.startLine.line,
                    startColumn: params.codedata.lineRange.startLine.offset
                };
                const res: ResourceSourceCodeResponse = await context.langClient.updateResourceSourceCode(params);
                const position = await this.updateSource(res, undefined, targetPosition);
                const result: SourceUpdateResponse = {
                    filePath: params.filePath,
                    position: position
                };
                resolve(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    private async updateSource(params: ListenerSourceCodeResponse, identifiers?: string[], targetPosition?: NodePosition): Promise<NodePosition> {
        StateMachine.setEditMode();
        const modificationRequests: Record<string, { filePath: string; modifications: STModification[] }> = {};
        let position: NodePosition;
        const sortedTextEdits = Object.entries(params.textEdits).sort((a, b) => b[0].length - a[0].length);
        for (const [key, value] of sortedTextEdits) {
            const fileUri = Uri.file(key);
            const fileUriString = fileUri.toString();
            if (!existsSync(fileUri.fsPath)) {
                writeFileSync(fileUri.fsPath, '');
                await new Promise(resolve => setTimeout(resolve, 500)); // Add small delay to ensure file is created
                await StateMachine.langClient().didOpen({
                    textDocument: {
                        uri: fileUriString,
                        text: '',
                        languageId: 'ballerina',
                        version: 1
                    }
                });
            }
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
        try {
            for (const [fileUriString, request] of Object.entries(modificationRequests)) {
                const { parseSuccess, source, syntaxTree } = (await StateMachine.langClient().stModify({
                    documentIdentifier: { uri: fileUriString },
                    astModifications: request.modifications,
                })) as SyntaxTree;

                if (parseSuccess) {
                    const fileUri = Uri.file(request.filePath);
                    const workspaceEdit = new vscode.WorkspaceEdit();
                    workspaceEdit.replace(
                        fileUri,
                        new vscode.Range(
                            new vscode.Position(0, 0),
                            new vscode.Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
                        ),
                        source
                    );
                    await workspace.applyEdit(workspaceEdit);
                    await StateMachine.langClient().resolveMissingDependencies({
                        documentIdentifier: { uri: fileUriString },
                    });
                }
            }
        } catch (error) {
            console.log(">>> error updating source", error);
        }
        return position;
    }

    async getListenerModelFromCode(params: ListenerModelFromCodeRequest): Promise<ListenerModelFromCodeResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const res: ListenerModelFromCodeResponse = await context.langClient.getListenerFromSourceCode(params);
                resolve(res);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async addFunctionSourceCode(params: FunctionSourceCodeRequest): Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const targetPosition: NodePosition = {
                    startLine: params.codedata.lineRange.startLine.line,
                    startColumn: params.codedata.lineRange.startLine.offset
                };
                const res: ResourceSourceCodeResponse = await context.langClient.addFunctionSourceCode(params);
                const position = await this.updateSource(res, undefined, targetPosition);
                const result: SourceUpdateResponse = {
                    filePath: params.filePath,
                    position: position
                };
                resolve(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async getTriggerModels(params: TriggerModelsRequest): Promise<TriggerModelsResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const res: TriggerModelsResponse = await context.langClient.getTriggerModels(params);
                resolve(res);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async getFunctionModel(params: FunctionModelRequest): Promise<FunctionModelResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const res: FunctionModelResponse = await context.langClient.getFunctionModel(params);
                resolve(res);
            } catch (error) {
                console.log(">>> error fetching function model", error);
            }
        });
    }

    private ensureFileExists(targetFile: string) {
        // Check if the file exists
        if (!fs.existsSync(targetFile)) {
            // Create the file if it does not exist
            fs.writeFileSync(targetFile, "");
            console.log(`>>> Created file at ${targetFile}`);
        }
    }
}
