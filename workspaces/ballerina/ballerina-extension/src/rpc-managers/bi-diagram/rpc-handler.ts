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
    AIChatRequest,
    AddFieldRequest,
    AddFunctionRequest,
    BIAiSuggestionsRequest,
    BIAvailableNodesRequest,
    BIDeleteByComponentInfoRequest,
    BIGetEnclosedFunctionRequest,
    BIGetVisibleVariableTypesRequest,
    BINodeTemplateRequest,
    BISearchRequest,
    BISourceCodeRequest,
    BreakpointRequest,
    BuildMode,
    ClassFieldModifierRequest,
    ComponentRequest,
    DeploymentRequest,
    EndOfFileRequest,
    ExpressionCompletionsRequest,
    ExpressionDiagnosticsRequest,
    FormDidCloseParams,
    FormDidOpenParams,
    FunctionNodeRequest,
    GetRecordConfigRequest,
    GetRecordModelFromSourceRequest,
    GetTypeRequest,
    GetTypesRequest,
    ModelFromCodeRequest,
    OpenAPIClientDeleteRequest,
    OpenAPIClientGenerationRequest,
    OpenAPIGeneratedModulesRequest,
    ProjectRequest,
    ReadmeContentRequest,
    RecordSourceGenRequest,
    RenameIdentifierRequest,
    ServiceClassSourceRequest,
    SignatureHelpRequest,
    UpdateConfigVariableRequest,
    UpdateImportsRequest,
    UpdateRecordConfigRequest,
    UpdateTypeRequest,
    UpdateTypesRequest,
    VisibleTypesRequest,
    addBreakpointToSource,
    addClassField,
    addFunction,
    buildProject,
    createComponent,
    createGraphqlClassType,
    createProject,
    deleteByComponentInfo,
    deleteFlowNode,
    deleteOpenApiGeneratedModules,
    deployProject,
    formDidClose,
    formDidOpen,
    generateOpenApiClient,
    getAiSuggestions,
    getAllImports,
    getAvailableNodes,
    getBreakpointInfo,
    getConfigVariables,
    getDesignModel,
    getDevantMetadata,
    getEnclosedFunction,
    getEndOfFile,
    getExpressionCompletions,
    getExpressionDiagnostics,
    getFlowModel,
    getFunctionNames,
    getFunctionNode,
    getModuleNodes,
    getNodeTemplate,
    getOpenApiGeneratedModules,
    getProjectComponents,
    getProjectStructure,
    getReadmeContent,
    getRecordConfig,
    getRecordModelFromSource,
    getRecordNames,
    getRecordSource,
    getServiceClassModel,
    getSignatureHelp,
    getSourceCode,
    getType,
    getTypes,
    getVisibleTypes,
    getVisibleVariableTypes,
    getWorkspaces,
    handleReadmeContent,
    openAIChat,
    openReadme,
    removeBreakpointFromSource,
    renameIdentifier,
    runProject,
    search,
    updateClassField,
    updateConfigVariables,
    updateImports,
    updateRecordConfig,
    updateServiceClass,
    updateType,
    updateTypes
} from "@wso2-enterprise/ballerina-core";
import { Messenger } from "vscode-messenger";
import { BiDiagramRpcManager } from "./rpc-manager";

export function registerBiDiagramRpcHandlers(messenger: Messenger) {
    const rpcManger = new BiDiagramRpcManager();
    messenger.onRequest(getFlowModel, () => rpcManger.getFlowModel());
    messenger.onRequest(getSourceCode, (args: BISourceCodeRequest) => rpcManger.getSourceCode(args));
    messenger.onRequest(deleteFlowNode, (args: BISourceCodeRequest) => rpcManger.deleteFlowNode(args));
    messenger.onRequest(deleteByComponentInfo, (args: BIDeleteByComponentInfoRequest) => rpcManger.deleteByComponentInfo(args));
    messenger.onRequest(getAvailableNodes, (args: BIAvailableNodesRequest) => rpcManger.getAvailableNodes(args));
    messenger.onRequest(getEnclosedFunction, (args: BIGetEnclosedFunctionRequest) => rpcManger.getEnclosedFunction(args));
    messenger.onRequest(getNodeTemplate, (args: BINodeTemplateRequest) => rpcManger.getNodeTemplate(args));
    messenger.onRequest(getAiSuggestions, (args: BIAiSuggestionsRequest) => rpcManger.getAiSuggestions(args));
    messenger.onNotification(createProject, (args: ProjectRequest) => rpcManger.createProject(args));
    messenger.onRequest(getWorkspaces, () => rpcManger.getWorkspaces());
    messenger.onRequest(getProjectStructure, () => rpcManger.getProjectStructure());
    messenger.onRequest(getProjectComponents, () => rpcManger.getProjectComponents());
    messenger.onRequest(createComponent, (args: ComponentRequest) => rpcManger.createComponent(args));
    messenger.onRequest(handleReadmeContent, (args: ReadmeContentRequest) => rpcManger.handleReadmeContent(args));
    messenger.onRequest(getVisibleVariableTypes, (args: BIGetVisibleVariableTypesRequest) => rpcManger.getVisibleVariableTypes(args));
    messenger.onRequest(getExpressionCompletions, (args: ExpressionCompletionsRequest) => rpcManger.getExpressionCompletions(args));
    messenger.onRequest(getConfigVariables, () => rpcManger.getConfigVariables());
    messenger.onRequest(updateConfigVariables, (args: UpdateConfigVariableRequest) => rpcManger.updateConfigVariables(args));
    messenger.onRequest(getModuleNodes, () => rpcManger.getModuleNodes());
    messenger.onRequest(getReadmeContent, () => rpcManger.getReadmeContent());
    messenger.onNotification(openReadme, () => rpcManger.openReadme());
    messenger.onRequest(renameIdentifier, (args: RenameIdentifierRequest) => rpcManger.renameIdentifier(args));
    messenger.onRequest(deployProject, (args: DeploymentRequest) => rpcManger.deployProject(args));
    messenger.onNotification(openAIChat, (args: AIChatRequest) => rpcManger.openAIChat(args));
    messenger.onRequest(getSignatureHelp, (args: SignatureHelpRequest) => rpcManger.getSignatureHelp(args));
    messenger.onNotification(buildProject, (args: BuildMode) => rpcManger.buildProject(args));
    messenger.onNotification(runProject, () => rpcManger.runProject());
    messenger.onRequest(getVisibleTypes, (args: VisibleTypesRequest) => rpcManger.getVisibleTypes(args));
    messenger.onNotification(addBreakpointToSource, (args: BreakpointRequest) => rpcManger.addBreakpointToSource(args));
    messenger.onNotification(removeBreakpointFromSource, (args: BreakpointRequest) => rpcManger.removeBreakpointFromSource(args));
    messenger.onRequest(getBreakpointInfo, () => rpcManger.getBreakpointInfo());
    messenger.onRequest(getExpressionDiagnostics, (args: ExpressionDiagnosticsRequest) => rpcManger.getExpressionDiagnostics(args));
    messenger.onRequest(getAllImports, () => rpcManger.getAllImports());
    messenger.onNotification(formDidOpen, (args: FormDidOpenParams) => rpcManger.formDidOpen(args));
    messenger.onNotification(formDidClose, (args: FormDidCloseParams) => rpcManger.formDidClose(args));
    messenger.onRequest(getDesignModel, () => rpcManger.getDesignModel());
    messenger.onRequest(getTypes, (args: GetTypesRequest) => rpcManger.getTypes(args));
    messenger.onRequest(getType, (args: GetTypeRequest) => rpcManger.getType(args));
    messenger.onRequest(updateType, (args: UpdateTypeRequest) => rpcManger.updateType(args));
    messenger.onRequest(updateTypes, (args: UpdateTypesRequest) => rpcManger.updateTypes(args));
    messenger.onRequest(getServiceClassModel, (args: ModelFromCodeRequest) => rpcManger.getServiceClassModel(args));
    messenger.onRequest(updateClassField, (args: ClassFieldModifierRequest) => rpcManger.updateClassField(args));
    messenger.onRequest(addClassField, (args: AddFieldRequest) => rpcManger.addClassField(args));
    messenger.onRequest(updateServiceClass, (args: ServiceClassSourceRequest) => rpcManger.updateServiceClass(args));
    messenger.onRequest(createGraphqlClassType, (args: UpdateTypeRequest) => rpcManger.createGraphqlClassType(args));
    messenger.onRequest(getRecordConfig, (args: GetRecordConfigRequest) => rpcManger.getRecordConfig(args));
    messenger.onRequest(updateRecordConfig, (args: UpdateRecordConfigRequest) => rpcManger.updateRecordConfig(args));
    messenger.onRequest(getRecordModelFromSource, (args: GetRecordModelFromSourceRequest) => rpcManger.getRecordModelFromSource(args));
    messenger.onRequest(getRecordSource, (args: RecordSourceGenRequest) => rpcManger.getRecordSource(args));
    messenger.onRequest(updateImports, (args: UpdateImportsRequest) => rpcManger.updateImports(args));
    messenger.onRequest(addFunction, (args: AddFunctionRequest) => rpcManger.addFunction(args));
    messenger.onRequest(getFunctionNode, (args: FunctionNodeRequest) => rpcManger.getFunctionNode(args));
    messenger.onRequest(getEndOfFile, (args: EndOfFileRequest) => rpcManger.getEndOfFile(args));
    messenger.onRequest(search, (args: BISearchRequest) => rpcManger.search(args));
    messenger.onRequest(getRecordNames, () => rpcManger.getRecordNames());
    messenger.onRequest(getFunctionNames, () => rpcManger.getFunctionNames());
    messenger.onRequest(getDevantMetadata, () => rpcManger.getDevantMetadata());
    messenger.onRequest(generateOpenApiClient, (args: OpenAPIClientGenerationRequest) => rpcManger.generateOpenApiClient(args));
    messenger.onRequest(getOpenApiGeneratedModules, (args: OpenAPIGeneratedModulesRequest) => rpcManger.getOpenApiGeneratedModules(args));
    messenger.onRequest(deleteOpenApiGeneratedModules, (args: OpenAPIClientDeleteRequest) => rpcManger.deleteOpenApiGeneratedModules(args));
}
