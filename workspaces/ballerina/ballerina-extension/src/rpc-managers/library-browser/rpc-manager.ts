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
    LibrarySearchResponse
} from "@wso2-enterprise/ballerina-core";
import { getAllResources, getLibrariesList, getLibraryData } from "../../features/library-browser";

export class LibraryBrowserRpcManager implements LibraryBrowserAPI {
    async getLibrariesList(params: LibrariesListRequest): Promise<LibrariesListResponse> {
        return getLibrariesList(params.kind);
    }

    async getLibrariesData(): Promise<LibrarySearchResponse> {
        return getAllResources();
    }

    async getLibraryData(params: LibraryDataRequest): Promise<LibraryDataResponse> {
        return getLibraryData(params.orgName, params.moduleName, params.version);
    }
}
