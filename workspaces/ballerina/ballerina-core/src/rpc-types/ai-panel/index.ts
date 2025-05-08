
/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
*
* This software is the property of WSO2 LLC. and its suppliers, if any.
* Dissemination of any information or reproduction of any material contained
* herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
* You may not alter or remove any copyright or other notice from copies of this content.
*/
import { AIVisualizerState, AddToProjectRequest, GetFromFileRequest, DeleteFromProjectRequest, GenerateMappingsRequest, GenerateMappingsResponse, NotifyAIMappingsRequest, ProjectSource, ProjectDiagnostics, GenerateMappingsFromRecordRequest, GenerateMappingFromRecordResponse, PostProcessRequest, PostProcessResponse, GenerateTypesFromRecordRequest, GenerateTypesFromRecordResponse, FetchDataRequest, FetchDataResponse, TestGenerationRequest, TestGenerationResponse, TestGenerationMentions, AIChatSummary, DeveloperDocument, RequirementSpecification, LLMDiagnostics, GetModuleDirParams, AIPanelPrompt } from "./interfaces";

export interface AIPanelAPI {
    // ==================================
    // General Functions
    // ==================================
    getBackendUrl: () => Promise<string>;
    getProjectUuid: () => Promise<string>;
    getAccessToken: () => Promise<string>;
    getRefreshToken: () => Promise<string>;
    getDefaultPrompt: () => Promise<AIPanelPrompt>;
    login: () => void;
    logout: () => void;
    getAiPanelState: () => Promise<AIVisualizerState>;
    fetchData: (params: FetchDataRequest) => Promise<FetchDataResponse>;
    addToProject: (content: AddToProjectRequest) => void;
    getFromFile: (content: GetFromFileRequest) => Promise<string>;
    getFileExists: (content: GetFromFileRequest) => Promise<boolean>;
    deleteFromProject: (content: DeleteFromProjectRequest) => void;
    getThemeKind: () => Promise<string>;
    generateMappings: (params: GenerateMappingsRequest) => Promise<GenerateMappingsResponse>;
    notifyAIMappings: (params: NotifyAIMappingsRequest) => Promise<boolean>;
    stopAIMappings: () => Promise<GenerateMappingsResponse>;
    promptLogin: () => Promise<boolean>;
    getProjectSource: (requestType: string) => Promise<ProjectSource>;
    getShadowDiagnostics: (project: ProjectSource) => Promise<ProjectDiagnostics>;
    checkSyntaxError: (project: ProjectSource) => Promise<boolean>;
    clearInitialPrompt: () => void;
    // Test-generator related functions
    getGeneratedTests: (params: TestGenerationRequest) => Promise<TestGenerationResponse>;
    getTestDiagnostics: (params: TestGenerationResponse) => Promise<ProjectDiagnostics>;
    getServiceSourceForName: (params: string) => Promise<string>;
    getResourceSourceForMethodAndPath: (params: string) => Promise<string>;
    getServiceNames: () => Promise<TestGenerationMentions>;
    getResourceMethodAndPaths: () => Promise<TestGenerationMentions>;
    abortTestGeneration: () => void;
    getMappingsFromRecord: (params: GenerateMappingsFromRecordRequest) => Promise<GenerateMappingFromRecordResponse>;
    getTypesFromRecord: (params: GenerateTypesFromRecordRequest) => Promise<GenerateTypesFromRecordResponse>;
    applyDoOnFailBlocks: () => void;
    postProcess: (req: PostProcessRequest) => Promise<PostProcessResponse>;
    getActiveFile:() => Promise<string>;
    openSettings: () => void;
    openChat: () => void;
    promptGithubAuthorize: () => Promise<boolean>;
    promptWSO2AILogout: () => Promise<boolean>;
    isCopilotSignedIn: () => Promise<boolean>;
    isWSO2AISignedIn: () => Promise<boolean>;
    showSignInAlert: () => Promise<boolean>;
    markAlertShown: () => void;
    getFromDocumentation: (content: string) => Promise<string>;
    isRequirementsSpecificationFileExist:(filePath: string) => Promise<boolean>;
    getDriftDiagnosticContents:(projectPath: string) => Promise<LLMDiagnostics>;
    addChatSummary:(filepathAndSummary: AIChatSummary) => Promise<boolean>;
    handleChatSummaryError:(message: string) => void;
    isNaturalProgrammingDirectoryExists:(projectPath: string) => Promise<boolean>;
    readDeveloperMdFile:(directoryPath: string) => Promise<string>;
    updateDevelopmentDocument:(developerDocument: DeveloperDocument) => void;
    updateRequirementSpecification:(requirementsSpecification: RequirementSpecification) => void;
    createTestDirecoryIfNotExists:(directoryPath: string) => void;
    getModuleDirectory:(params: GetModuleDirParams) => Promise<string>;
    getContentFromFile: (content: GetFromFileRequest) => Promise<string>;
}
