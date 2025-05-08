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
    LibrariesListRequest,
    LibraryDataRequest,
    getLibrariesData,
    getLibrariesList,
    getLibraryData
} from "@wso2-enterprise/ballerina-core";
import { Messenger } from "vscode-messenger";
import { LibraryBrowserRpcManager } from "./rpc-manager";

export function registerLibraryBrowserRpcHandlers(messenger: Messenger) {
    const rpcManger = new LibraryBrowserRpcManager();
    messenger.onRequest(getLibrariesList, (args: LibrariesListRequest) => rpcManger.getLibrariesList(args));
    messenger.onRequest(getLibrariesData, () => rpcManger.getLibrariesData());
    messenger.onRequest(getLibraryData, (args: LibraryDataRequest) => rpcManger.getLibraryData(args));
}
