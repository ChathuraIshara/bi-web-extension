/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
    Schema
} from "./types";

export interface APIDesignerVisualizerAPI {
    openView: (params: OpenViewRequest) => void;
    goBack: () => void;
    getHistory: () => Promise<HistoryEntryResponse>;
    addToHistory: (params: HistoryEntry) => void;
    goHome: () => void;
    goToSource: (params: GoToSourceRequest) => void;
    getOpenApiContent: (params: GetOpenAPIContentRequest) => Promise<GetOpenAPIContentResponse>;
    writeOpenApiContent: (params: WriteOpenAPIContentRequest) => Promise<WriteOpenAPIContentResponse>;
    importJSON: () => Promise<Schema | undefined>;
}
