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
import { HistoryEntry } from "../../history";
import {
    OpenViewRequest,
    HistoryEntryResponse,
    GoToSourceRequest,
    GetOpenAPIContentRequest,
    GetOpenAPIContentResponse,
    WriteOpenAPIContentResponse,
    WriteOpenAPIContentRequest,
} from "./types";
import { NotificationType, RequestType } from "vscode-messenger-common";

const _preFix = "api-designer-visualizer";
export const openView: NotificationType<OpenViewRequest> = { method: `${_preFix}/openView` };
export const goBack: NotificationType<void> = { method: `${_preFix}/goBack` };
export const getHistory: RequestType<void, HistoryEntryResponse> = { method: `${_preFix}/getHistory` };
export const addToHistory: NotificationType<HistoryEntry> = { method: `${_preFix}/addToHistory` };
export const goHome: NotificationType<void> = { method: `${_preFix}/goHome` };
export const goToSource: NotificationType<GoToSourceRequest> = { method: `${_preFix}/goToSource` };
export const getOpenApiContent: RequestType<GetOpenAPIContentRequest, GetOpenAPIContentResponse> = { method: `${_preFix}/getOpenApiContent` };
export const writeOpenApiContent: RequestType<WriteOpenAPIContentRequest, WriteOpenAPIContentResponse> = { method: `${_preFix}/writeOpenApiContent` };
export const importJSON: NotificationType<void> = { method: `${_preFix}/importJSON` };
