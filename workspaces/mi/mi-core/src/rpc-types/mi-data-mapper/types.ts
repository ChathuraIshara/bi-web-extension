/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { DMType } from "../../interfaces/mi-data-mapper";

export enum DMDiagnosticCategory {
    Warning = 0,
    Error = 1,
    Suggestion = 2,
    Message = 3,
}

export enum IOType {
    Input = "input",
    Output = "output",
    Other = "other"
}

export interface DMDiagnostic {
    messageText: string;
    code: number;
    category: DMDiagnosticCategory;
    start: number | undefined;
    length: number | undefined;
    source?: string;
}

export interface DMTypeRequest {
    filePath: string;
    functionName: string;
}

export interface IOTypeResponse {
    inputTrees: DMType[];
    outputTree: DMType | undefined;
    recursiveTypes: Record<string, DMType | undefined>;
}

export interface SubMappingTypesResponse {
    variableTypes: Record<string, DMType | undefined>;
}

export interface UpdateFileContentRequest {
    filePath: string;
    fileContent: string;
}

export interface GenerateDMInputRequest {
    filePath: string;
    dmLocation: string;
    dmName: string;
}

export interface GenerateDMInputResponse {
    success: boolean;
}

export interface BrowseSchemaRequest {
    documentUri: string;
    overwriteSchema?: boolean;
    content: string;
    ioType: IOType;
    schemaType: string;
    configName: string;
    typeName?: string;
    csvDelimiter?: string;
}

export interface BrowseSchemaResponse {
    success: boolean;
}

export interface LoadDMConfigsRequest {
    filePath: string;
}

export interface LoadDMConfigsResponse {
    dmConfigs: string[];
}

export interface ConvertRegPathToAbsPathRequest {
    regPath: string;
    sourcePath: string;
}

export interface ConvertRegPathToAbsPathResponse {
    absPath: string;
    configName: string;
}

interface SchemaGenBaseRequest {
    delimiter: string;
    type: string;
    title: string;
}

export interface SchemaGenRequest extends SchemaGenBaseRequest {
    filePath: string;
}

export interface SchemaGenFromContentRequest extends SchemaGenBaseRequest {
    fileContent: string;
}

export interface SchemaGenResponse {
    schema: string;
}

export interface UpdateDMUndoRedoMangerRequest {
    filePath: string;
    fileContent: string;
}

export interface GetCompletionsRequest {
    filePath: string;
    fileContent: string;
    cursorPosition: number;
}

export interface GetCompletionsResponse {
    completions: unknown[];
}

export interface GetDMDiagnosticsRequest {
    filePath: string;
}

export interface GetDMDiagnosticsResponse {
    diagnostics: DMDiagnostic[];
}

export interface DataMapWriteRequest {
    dataMapping: string;
}
