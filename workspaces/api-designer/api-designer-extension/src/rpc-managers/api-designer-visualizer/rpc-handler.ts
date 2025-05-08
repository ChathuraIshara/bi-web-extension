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
    GetOpenAPIContentRequest,
    GoToSourceRequest,
    HistoryEntry,
    OpenViewRequest,
    WriteOpenAPIContentRequest,
    addToHistory,
    getHistory,
    getOpenApiContent,
    goBack,
    goHome,
    goToSource,
    importJSON,
    openView,
    writeOpenApiContent,
} from "@wso2-enterprise/api-designer-core";
import { Messenger } from "vscode-messenger";
import { ApiDesignerVisualizerRpcManager } from "./rpc-manager";

export function registerApiDesignerVisualizerRpcHandlers(messenger: Messenger) {
    const rpcManger = new ApiDesignerVisualizerRpcManager();
    messenger.onNotification(openView, (args: OpenViewRequest) => rpcManger.openView(args));
    messenger.onNotification(goBack, () => rpcManger.goBack());
    messenger.onRequest(getHistory, () => rpcManger.getHistory());
    messenger.onNotification(addToHistory, (args: HistoryEntry) => rpcManger.addToHistory(args));
    messenger.onNotification(goHome, () => rpcManger.goHome());
    messenger.onNotification(goToSource, (args: GoToSourceRequest) => rpcManger.goToSource(args));
    messenger.onRequest(getOpenApiContent, (args: GetOpenAPIContentRequest) => rpcManger.getOpenApiContent(args));
    messenger.onRequest(writeOpenApiContent, (args: WriteOpenAPIContentRequest) => rpcManger.writeOpenApiContent(args));
    messenger.onRequest(importJSON, () => rpcManger.importJSON());
}
