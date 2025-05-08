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
    LibrariesListResponse,
    LibraryBrowserAPI,
    LibraryDataRequest,
    LibraryDataResponse,
    LibrarySearchResponse,
    getLibrariesData,
    getLibrariesList,
    getLibraryData
} from "@wso2-enterprise/ballerina-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class LibraryBrowserRpcClient implements LibraryBrowserAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    getLibrariesList(params: LibrariesListRequest): Promise<LibrariesListResponse> {
        return this._messenger.sendRequest(getLibrariesList, HOST_EXTENSION, params);
    }

    getLibrariesData(): Promise<LibrarySearchResponse> {
        return this._messenger.sendRequest(getLibrariesData, HOST_EXTENSION);
    }

    getLibraryData(params: LibraryDataRequest): Promise<LibraryDataResponse> {
        return this._messenger.sendRequest(getLibraryData, HOST_EXTENSION, params);
    }
}
