/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { 
    DMTypeRequest, 
    IOTypeResponse, 
    UpdateFileContentRequest,
    GenerateDMInputRequest, 
    GenerateDMInputResponse,
    LoadDMConfigsRequest,
    LoadDMConfigsResponse,
    ConvertRegPathToAbsPathRequest,
    ConvertRegPathToAbsPathResponse,
    SubMappingTypesResponse,
    UpdateDMUndoRedoMangerRequest,
    GetCompletionsRequest,
    GetCompletionsResponse,
    GetDMDiagnosticsRequest,
    GetDMDiagnosticsResponse,
    DataMapWriteRequest
} from "./types";

export interface MIDataMapperAPI {
    getIOTypes: (params: DMTypeRequest) => Promise<IOTypeResponse>;
    getSubMappingTypes: (params: DMTypeRequest) => Promise<SubMappingTypesResponse>;
    updateFileContent: (params: UpdateFileContentRequest) => Promise<void>;
    loadDMConfigs: (params: LoadDMConfigsRequest) => Promise<LoadDMConfigsResponse>;
    convertRegPathToAbsPath: (params: ConvertRegPathToAbsPathRequest) => Promise<ConvertRegPathToAbsPathResponse>;
    createDMFiles: (params: GenerateDMInputRequest) => Promise<GenerateDMInputResponse>;
    initDMUndoRedoManager: (params: UpdateDMUndoRedoMangerRequest) => void;
    dmUndo: () => Promise<string | undefined>;
    dmRedo: () => Promise<string | undefined>;
    addToDMUndoStack: (source: string) => void;
    updateDMUndoRedoManager: (params: UpdateDMUndoRedoMangerRequest) => void;
    getCompletions: (params: GetCompletionsRequest) => Promise<GetCompletionsResponse>;
    getDMDiagnostics: (params: GetDMDiagnosticsRequest) => Promise<GetDMDiagnosticsResponse>;
    getMappingFromAI: () => void;
    writeDataMapping: (params: DataMapWriteRequest)=> void;
    confirmMappingAction: ()=> Promise<boolean>;
    authenticateUser(): Promise<boolean>;
}
