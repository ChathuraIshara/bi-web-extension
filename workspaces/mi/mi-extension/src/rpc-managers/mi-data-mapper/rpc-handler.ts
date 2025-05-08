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
    getIOTypes,
    getSubMappingTypes,
    updateFileContent,
    UpdateFileContentRequest,
    GenerateDMInputRequest,
    browseSchema,
    BrowseSchemaRequest,
    LoadDMConfigsRequest,
    loadDMConfigs,
    ConvertRegPathToAbsPathRequest,
    convertRegPathToAbsPath,
    createDMFiles,
    initDMUndoRedoManager,
    dmUndo,
    dmRedo,
    addToDMUndoStack,
    updateDMUndoRedoManager,
    UpdateDMUndoRedoMangerRequest,
    getCompletions,
    GetCompletionsRequest,
    getDMDiagnostics,
    GetDMDiagnosticsRequest,
    getMappingFromAI,
    writeDataMapping,
    DataMapWriteRequest,
    confirmMappingAction,
    authenticateUser
} from "@wso2-enterprise/mi-core";
import { Messenger } from "vscode-messenger";
import { MiDataMapperRpcManager } from "./rpc-manager";

export function registerMiDataMapperRpcHandlers(messenger: Messenger) {
    const rpcManger = new MiDataMapperRpcManager();
    messenger.onRequest(getIOTypes, (args: DMTypeRequest) => rpcManger.getIOTypes(args));
    messenger.onRequest(getSubMappingTypes, (args: DMTypeRequest) => rpcManger.getSubMappingTypes(args));
    messenger.onRequest(updateFileContent, (args: UpdateFileContentRequest) => rpcManger.updateFileContent(args));
    messenger.onRequest(browseSchema, (args: BrowseSchemaRequest) => rpcManger.browseSchema(args));
    messenger.onRequest(loadDMConfigs, (args: LoadDMConfigsRequest) => rpcManger.loadDMConfigs(args));
    messenger.onRequest(convertRegPathToAbsPath, (args: ConvertRegPathToAbsPathRequest) => rpcManger.convertRegPathToAbsPath(args));
    messenger.onRequest(createDMFiles, (args: GenerateDMInputRequest) => rpcManger.createDMFiles(args));
    messenger.onNotification(initDMUndoRedoManager, (args: UpdateDMUndoRedoMangerRequest) => rpcManger.initDMUndoRedoManager(args));
    messenger.onRequest(dmUndo, () => rpcManger.dmUndo());
    messenger.onRequest(dmRedo, () => rpcManger.dmRedo());
    messenger.onNotification(addToDMUndoStack, (args: string) => rpcManger.addToDMUndoStack(args));
    messenger.onNotification(updateDMUndoRedoManager, (args: UpdateDMUndoRedoMangerRequest) => rpcManger.updateDMUndoRedoManager(args));
    messenger.onRequest(getCompletions, (args: GetCompletionsRequest) => rpcManger.getCompletions(args));
    messenger.onRequest(getDMDiagnostics, (args: GetDMDiagnosticsRequest) => rpcManger.getDMDiagnostics(args));
    messenger.onRequest(getMappingFromAI, () => rpcManger.getMappingFromAI());
    messenger.onNotification(writeDataMapping, (args: DataMapWriteRequest) => rpcManger.writeDataMapping(args));
    messenger.onRequest(confirmMappingAction, () => rpcManger.confirmMappingAction());
    messenger.onRequest(authenticateUser, () => rpcManger.authenticateUser());

}
