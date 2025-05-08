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
    BallerinaPackagesParams,
    BallerinaSTParams,
    CodeActionRequest,
    CompletionRequest,
    ComponentModelsParams,
    DefinitionPositionRequest,
    DidChangeRequest,
    DidCloseRequest,
    DidOpenRequest,
    ExecutorPositionsRequest,
    PartialSTParams,
    RenameRequest,
    STModifyParams,
    SymbolInfoParams,
    SyntaxTreeParams,
    TypeFromExpressionParams,
    TypeFromSymbolParams,
    TypesFromFnDefinitionParams,
    UpdateFileContentRequest,
    codeAction,
    definition,
    didChange,
    didClose,
    didOpen,
    getBallerinaProjectComponents,
    getBallerinaVersion,
    getCompletion,
    getDefinitionPosition,
    getDiagnostics,
    getExecutorPositions,
    getPackageComponentModels,
    getST,
    getSTByRange,
    getSTForExpression,
    getSTForFunction,
    getSTForModuleMembers,
    getSTForModulePart,
    getSTForResource,
    getSTForSingleStatement,
    getSymbolDocumentation,
    getSyntaxTree,
    getTypeFromExpression,
    getTypeFromSymbol,
    getTypesFromFnDefinition,
    rename,
    stModify,
    updateFileContent
} from "@wso2-enterprise/ballerina-core";
import { Messenger } from "vscode-messenger";
import { LangClientRpcManager } from "./rpc-manager";

export function registerLangClientRpcHandlers(messenger: Messenger) {
    const rpcManger = new LangClientRpcManager();
    messenger.onRequest(getSyntaxTree, () => rpcManger.getSyntaxTree());
    messenger.onRequest(getST, (args: SyntaxTreeParams) => rpcManger.getST(args));
    messenger.onRequest(getSTByRange, (args: BallerinaSTParams) => rpcManger.getSTByRange(args));
    messenger.onRequest(getBallerinaProjectComponents, (args: BallerinaPackagesParams) => rpcManger.getBallerinaProjectComponents(args));
    messenger.onRequest(getBallerinaVersion, () => rpcManger.getBallerinaVersion());
    messenger.onRequest(getCompletion, (args: CompletionRequest) => rpcManger.getCompletion(args));
    messenger.onRequest(getDiagnostics, (args: SyntaxTreeParams) => rpcManger.getDiagnostics(args));
    messenger.onRequest(codeAction, (args: CodeActionRequest) => rpcManger.codeAction(args));
    messenger.onRequest(rename, (args: RenameRequest) => rpcManger.rename(args));
    messenger.onRequest(getDefinitionPosition, (args: DefinitionPositionRequest) => rpcManger.getDefinitionPosition(args));
    messenger.onRequest(stModify, (args: STModifyParams) => rpcManger.stModify(args));
    messenger.onRequest(updateFileContent, (args: UpdateFileContentRequest) => rpcManger.updateFileContent(args));
    messenger.onRequest(getTypeFromExpression, (args: TypeFromExpressionParams) => rpcManger.getTypeFromExpression(args));
    messenger.onRequest(getTypeFromSymbol, (args: TypeFromSymbolParams) => rpcManger.getTypeFromSymbol(args));
    messenger.onRequest(getTypesFromFnDefinition, (args: TypesFromFnDefinitionParams) => rpcManger.getTypesFromFnDefinition(args));
    messenger.onRequest(definition, (args: DefinitionPositionRequest) => rpcManger.definition(args));
    messenger.onRequest(getSTForFunction, (args: STModifyParams) => rpcManger.getSTForFunction(args));
    messenger.onRequest(getExecutorPositions, (args: ExecutorPositionsRequest) => rpcManger.getExecutorPositions(args));
    messenger.onRequest(getSTForExpression, (args: PartialSTParams) => rpcManger.getSTForExpression(args));
    messenger.onRequest(getSTForSingleStatement, (args: PartialSTParams) => rpcManger.getSTForSingleStatement(args));
    messenger.onRequest(getSTForResource, (args: PartialSTParams) => rpcManger.getSTForResource(args));
    messenger.onRequest(getSTForModuleMembers, (args: PartialSTParams) => rpcManger.getSTForModuleMembers(args));
    messenger.onRequest(getSTForModulePart, (args: PartialSTParams) => rpcManger.getSTForModulePart(args));
    messenger.onRequest(getSymbolDocumentation, (args: SymbolInfoParams) => rpcManger.getSymbolDocumentation(args));
    messenger.onNotification(didOpen, (args: DidOpenRequest) => rpcManger.didOpen(args));
    messenger.onNotification(didChange, (args: DidChangeRequest) => rpcManger.didChange(args));
    messenger.onNotification(didClose, (args: DidCloseRequest) => rpcManger.didClose(args));
    messenger.onRequest(getPackageComponentModels, (args: ComponentModelsParams) => rpcManger.getPackageComponentModels(args));
}
