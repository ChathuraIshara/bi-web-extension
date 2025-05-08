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
    BallerinaDiagnosticsRequest,
    BallerinaDiagnosticsResponse,
    CommandsRequest,
    CommandsResponse,
    GoToSourceRequest,
    OpenExternalUrlRequest,
    FileOrDirResponse,
    RunExternalCommandRequest,
    RunExternalCommandResponse,
    TypeResponse,
    WorkspaceFileRequest,
    WorkspacesFileResponse,
    FileOrDirRequest,
    WorkspaceRootResponse,
    ShowErrorMessageRequest
} from "./interfaces";
import { RequestType, NotificationType } from "vscode-messenger-common";

const _preFix = "common";
export const getTypeCompletions: RequestType<void, TypeResponse> = { method: `${_preFix}/getTypeCompletions` };
export const goToSource: NotificationType<GoToSourceRequest> = { method: `${_preFix}/goToSource` };
export const getWorkspaceFiles: RequestType<WorkspaceFileRequest, WorkspacesFileResponse> = { method: `${_preFix}/getWorkspaceFiles` };
export const getBallerinaDiagnostics: RequestType<BallerinaDiagnosticsRequest, BallerinaDiagnosticsResponse> = { method: `${_preFix}/getBallerinaDiagnostics` };
export const executeCommand: RequestType<CommandsRequest, CommandsResponse> = { method: `${_preFix}/executeCommand` };
export const runBackgroundTerminalCommand: RequestType<RunExternalCommandRequest, RunExternalCommandResponse> = { method: `${_preFix}/runBackgroundTerminalCommand` };
export const openExternalUrl: NotificationType<OpenExternalUrlRequest> = { method: `${_preFix}/openExternalUrl` };
export const selectFileOrDirPath: RequestType<FileOrDirRequest, FileOrDirResponse> = { method: `${_preFix}/selectFileOrDirPath` };
export const experimentalEnabled: RequestType<void, boolean> = { method: `${_preFix}/experimentalEnabled` };
export const isNPSupported: RequestType<void, boolean> = { method: `${_preFix}/isNPSupported` };
export const getWorkspaceRoot: RequestType<void, WorkspaceRootResponse> = { method: `${_preFix}/getWorkspaceRoot` };
export const showErrorMessage: NotificationType<ShowErrorMessageRequest> = { method: `${_preFix}/showErrorMessage` };
