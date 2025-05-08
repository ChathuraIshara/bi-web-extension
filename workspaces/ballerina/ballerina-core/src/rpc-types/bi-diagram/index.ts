/*
 *  Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 *  This software is the property of WSO2 LLC. and its suppliers, if any.
 *  Dissemination of any information or reproduction of any material contained
 *  herein is strictly forbidden, unless permitted by WSO2 in accordance with
 *  the WSO2 Commercial License available at http://wso2.com/licenses.
 *  For specific language governing the permissions and limitations under
 *  this license, please see the license as well as any agreement you’ve
 *  entered into with WSO2 governing the purchase of this software and any
 *  associated services.
 */

import { ProjectStructureResponse } from "../../interfaces/bi";
import { LinePosition } from "../../interfaces/common";
import {
    BIAvailableNodesRequest,
    BIAvailableNodesResponse,
    BIFlowModelResponse,
    BINodeTemplateRequest,
    BINodeTemplateResponse,
    BISourceCodeRequest,
    BISourceCodeResponse,
    BIModuleNodesResponse,
    ExpressionCompletionsRequest,
    ExpressionCompletionsResponse,
    ConfigVariableResponse,
    UpdateConfigVariableRequest,
    UpdateConfigVariableResponse,
    SignatureHelpRequest,
    SignatureHelpResponse,
    BIGetVisibleVariableTypesRequest,
    BIGetVisibleVariableTypesResponse,
    VisibleTypesRequest,
    VisibleTypesResponse,
    BIDeleteByComponentInfoRequest,
    BIDeleteByComponentInfoResponse,
    ExpressionDiagnosticsRequest,
    ExpressionDiagnosticsResponse,
    BIGetEnclosedFunctionRequest,
    BIGetEnclosedFunctionResponse,
    BIDesignModelResponse,
    GetTypesResponse,
    UpdateTypeResponse,
    GetTypesRequest,
    UpdateTypeRequest,
    GetTypeRequest,
    GetTypeResponse,
    UpdateImportsRequest,
    UpdateImportsResponse,
    AddFunctionRequest,
    AddImportItemResponse,
    FunctionNodeRequest,
    FunctionNodeResponse,
    ServiceClassModelResponse,
    ModelFromCodeRequest,
    ClassFieldModifierRequest,
    SourceEditResponse,
    ServiceClassSourceRequest,
    AddFieldRequest,
    RenameIdentifierRequest,
    BISearchRequest,
    BISearchResponse,
    GetRecordConfigRequest,
    GetRecordConfigResponse,
    UpdateRecordConfigRequest,
    RecordSourceGenRequest,
    RecordSourceGenResponse,
    GetRecordModelFromSourceResponse,
    GetRecordModelFromSourceRequest,
    UpdateTypesRequest,
    UpdateTypesResponse,
    DeploymentRequest,
    DeploymentResponse,
    OpenAPIClientGenerationRequest,
    OpenAPIGeneratedModulesRequest,
    OpenAPIGeneratedModulesResponse,
    OpenAPIClientDeleteRequest,
    OpenAPIClientDeleteResponse
} from "../../interfaces/extended-lang-client";
import {
    ProjectRequest,
    WorkspacesResponse,
    ProjectComponentsResponse,
    ComponentRequest,
    CreateComponentResponse,
    ReadmeContentRequest,
    ReadmeContentResponse,
    BIAiSuggestionsRequest,
    BIAiSuggestionsResponse,
    AIChatRequest,
    ProjectImports,
    BreakpointRequest,
    CurrentBreakpointsResponse,
    FormDidOpenParams,
    FormDidCloseParams,
    EndOfFileRequest,
    RecordsInWorkspaceMentions,
    BuildMode,
    DevantMetadata,
    GeneratedClientSaveResponse
} from "./interfaces";

export interface BIDiagramAPI {
    getFlowModel: () => Promise<BIFlowModelResponse>;
    getSourceCode: (params: BISourceCodeRequest) => Promise<BISourceCodeResponse>;
    deleteFlowNode: (params: BISourceCodeRequest) => Promise<BISourceCodeResponse>;
    deleteByComponentInfo: (params: BIDeleteByComponentInfoRequest) => Promise<BIDeleteByComponentInfoResponse>;
    getAvailableNodes: (params: BIAvailableNodesRequest) => Promise<BIAvailableNodesResponse>;
    getEnclosedFunction: (params: BIGetEnclosedFunctionRequest) => Promise<BIGetEnclosedFunctionResponse>;
    getNodeTemplate: (params: BINodeTemplateRequest) => Promise<BINodeTemplateResponse>;
    getAiSuggestions: (params: BIAiSuggestionsRequest) => Promise<BIAiSuggestionsResponse>;
    createProject: (params: ProjectRequest) => void;
    getWorkspaces: () => Promise<WorkspacesResponse>;
    getProjectStructure: () => Promise<ProjectStructureResponse>;
    getProjectComponents: () => Promise<ProjectComponentsResponse>;
    createComponent: (params: ComponentRequest) => Promise<CreateComponentResponse>;
    handleReadmeContent: (params: ReadmeContentRequest) => Promise<ReadmeContentResponse>;
    getVisibleVariableTypes: (params: BIGetVisibleVariableTypesRequest) => Promise<BIGetVisibleVariableTypesResponse>;
    getExpressionCompletions: (params: ExpressionCompletionsRequest) => Promise<ExpressionCompletionsResponse>;
    getConfigVariables: () => Promise<ConfigVariableResponse>;
    updateConfigVariables: (params: UpdateConfigVariableRequest) => Promise<UpdateConfigVariableResponse>;
    getModuleNodes: () => Promise<BIModuleNodesResponse>;
    getReadmeContent: () => Promise<ReadmeContentResponse>;
    openReadme: () => void;
    renameIdentifier: (params: RenameIdentifierRequest) => Promise<void>;
    deployProject: (params: DeploymentRequest) => Promise<DeploymentResponse>;
    openAIChat: (params: AIChatRequest) => void;
    getSignatureHelp: (params: SignatureHelpRequest) => Promise<SignatureHelpResponse>;
    buildProject: (mode: BuildMode) => void;
    runProject: () => void;
    getVisibleTypes: (params: VisibleTypesRequest) => Promise<VisibleTypesResponse>;
    addBreakpointToSource: (params: BreakpointRequest) => void;
    removeBreakpointFromSource: (params: BreakpointRequest) => void;
    getBreakpointInfo: () => Promise<CurrentBreakpointsResponse>;
    getExpressionDiagnostics: (params: ExpressionDiagnosticsRequest) => Promise<ExpressionDiagnosticsResponse>;
    getAllImports: () => Promise<ProjectImports>;
    formDidOpen: (params: FormDidOpenParams) => Promise<void>;
    formDidClose: (params: FormDidCloseParams) => Promise<void>;
    getDesignModel: () => Promise<BIDesignModelResponse>;
    getTypes: (params: GetTypesRequest) => Promise<GetTypesResponse>;
    getType: (params: GetTypeRequest) => Promise<GetTypeResponse>;
    updateType: (params: UpdateTypeRequest) => Promise<UpdateTypeResponse>;
    updateTypes: (params: UpdateTypesRequest) => Promise<UpdateTypesResponse>;
    getServiceClassModel: (params: ModelFromCodeRequest) => Promise<ServiceClassModelResponse>;
    updateClassField: (params: ClassFieldModifierRequest) => Promise<SourceEditResponse>;
    addClassField: (params: AddFieldRequest) => Promise<SourceEditResponse>;
    updateServiceClass: (params: ServiceClassSourceRequest) => Promise<SourceEditResponse>;
    createGraphqlClassType: (params: UpdateTypeRequest) => Promise<UpdateTypeResponse>;
    getRecordConfig: (params: GetRecordConfigRequest) => Promise<GetRecordConfigResponse>;
    updateRecordConfig: (params: UpdateRecordConfigRequest) => Promise<GetRecordConfigResponse>;
    getRecordModelFromSource: (params: GetRecordModelFromSourceRequest) => Promise<GetRecordModelFromSourceResponse>;
    getRecordSource: (params: RecordSourceGenRequest) => Promise<RecordSourceGenResponse>;
    updateImports: (params: UpdateImportsRequest) => Promise<UpdateImportsResponse>;
    addFunction: (params: AddFunctionRequest) => Promise<AddImportItemResponse>;
    getFunctionNode: (params: FunctionNodeRequest) => Promise<FunctionNodeResponse>;
    getEndOfFile: (params: EndOfFileRequest) => Promise<LinePosition>;
    search: (params: BISearchRequest) => Promise<BISearchResponse>;
    getRecordNames: () => Promise<RecordsInWorkspaceMentions>;
    getFunctionNames: () => Promise<RecordsInWorkspaceMentions>;
    getDevantMetadata: () => Promise<DevantMetadata | undefined>;
    generateOpenApiClient: (params: OpenAPIClientGenerationRequest) => Promise<GeneratedClientSaveResponse>;
    getOpenApiGeneratedModules: (params: OpenAPIGeneratedModulesRequest) => Promise<OpenAPIGeneratedModulesResponse>;
    deleteOpenApiGeneratedModules: (params: OpenAPIClientDeleteRequest) => Promise<OpenAPIClientDeleteResponse>;
}
