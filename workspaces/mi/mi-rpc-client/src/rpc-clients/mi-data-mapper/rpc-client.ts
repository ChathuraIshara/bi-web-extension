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
    DMTypeRequest,
    IOTypeResponse,
    SubMappingTypesResponse,
    MIDataMapperAPI,
    UpdateFileContentRequest,
    getIOTypes,
    getSubMappingTypes,
    updateFileContent,
    GenerateDMInputRequest,
    GenerateDMInputResponse,
    BrowseSchemaRequest,
    BrowseSchemaResponse,
    browseSchema,
    LoadDMConfigsRequest,
    LoadDMConfigsResponse,
    loadDMConfigs,
    ConvertRegPathToAbsPathRequest,
    ConvertRegPathToAbsPathResponse,
    convertRegPathToAbsPath,
    createDMFiles,
    UpdateDMUndoRedoMangerRequest,
    initDMUndoRedoManager,
    dmUndo,
    dmRedo,
    addToDMUndoStack,
    updateDMUndoRedoManager,
    getCompletions,
    GetCompletionsRequest,
    GetCompletionsResponse,
    GetDMDiagnosticsRequest,
    GetDMDiagnosticsResponse,
    getDMDiagnostics,
    getMappingFromAI,
    writeDataMapping,
    DataMapWriteRequest, 
    confirmMappingAction,
    authenticateUser
} from "@wso2-enterprise/mi-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class MiDataMapperRpcClient implements MIDataMapperAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    getIOTypes(params: DMTypeRequest): Promise<IOTypeResponse> {
        return this._messenger.sendRequest(getIOTypes, HOST_EXTENSION, params);
    }

    getSubMappingTypes(params: DMTypeRequest): Promise<SubMappingTypesResponse> {
        return this._messenger.sendRequest(getSubMappingTypes, HOST_EXTENSION, params);
    }

    updateFileContent(params: UpdateFileContentRequest): Promise<void> {
        return this._messenger.sendRequest(updateFileContent, HOST_EXTENSION, params);
    }

    browseSchema(params: BrowseSchemaRequest): Promise<BrowseSchemaResponse> {
        return this._messenger.sendRequest(browseSchema, HOST_EXTENSION, params);
    }

    loadDMConfigs(params: LoadDMConfigsRequest): Promise<LoadDMConfigsResponse> {
        return this._messenger.sendRequest(loadDMConfigs, HOST_EXTENSION, params);
    }

    convertRegPathToAbsPath(params: ConvertRegPathToAbsPathRequest): Promise<ConvertRegPathToAbsPathResponse> {
        return this._messenger.sendRequest(convertRegPathToAbsPath, HOST_EXTENSION, params);
    }

    createDMFiles(params: GenerateDMInputRequest): Promise<GenerateDMInputResponse> {
        return this._messenger.sendRequest(createDMFiles, HOST_EXTENSION, params);
    }

    initDMUndoRedoManager(params: UpdateDMUndoRedoMangerRequest): void {
        return this._messenger.sendNotification(initDMUndoRedoManager, HOST_EXTENSION, params);
    }

    dmUndo(): Promise<string> {
        return this._messenger.sendRequest(dmUndo, HOST_EXTENSION);
    }

    dmRedo(): Promise<string> {
        return this._messenger.sendRequest(dmRedo, HOST_EXTENSION);
    }

    addToDMUndoStack(source: string): void {
        return this._messenger.sendNotification(addToDMUndoStack, HOST_EXTENSION, source);
    }

    updateDMUndoRedoManager(params: UpdateDMUndoRedoMangerRequest): void {
        return this._messenger.sendNotification(updateDMUndoRedoManager, HOST_EXTENSION, params);
    }

    getCompletions(params: GetCompletionsRequest): Promise<GetCompletionsResponse> {
        return this._messenger.sendRequest(getCompletions, HOST_EXTENSION, params);
    }

    getDMDiagnostics(params: GetDMDiagnosticsRequest): Promise<GetDMDiagnosticsResponse> {
        return this._messenger.sendRequest(getDMDiagnostics, HOST_EXTENSION, params);
    }

    getMappingFromAI(): Promise<void> {
        return this._messenger.sendRequest(getMappingFromAI, HOST_EXTENSION);
    }

    writeDataMapping(params: DataMapWriteRequest): void {
        return this._messenger.sendNotification(writeDataMapping, HOST_EXTENSION, params);
    }

    confirmMappingAction(): Promise<boolean> {
        return this._messenger.sendRequest(confirmMappingAction, HOST_EXTENSION);
    }

    authenticateUser(): Promise<boolean> {
        return this._messenger.sendRequest(authenticateUser, HOST_EXTENSION);
    }
}
