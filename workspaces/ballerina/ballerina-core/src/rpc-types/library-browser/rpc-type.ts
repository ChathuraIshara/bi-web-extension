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
import { LibraryDataRequest, LibraryDataResponse, LibrariesListResponse, LibrarySearchResponse, LibrariesListRequest } from "./interfaces";
import { RequestType } from "vscode-messenger-common";

const _preFix = "library-browser";
export const getLibrariesList: RequestType<LibrariesListRequest, LibrariesListResponse> = { method: `${_preFix}/getLibrariesList` };
export const getLibrariesData: RequestType<void, LibrarySearchResponse> = { method: `${_preFix}/getLibrariesData` };
export const getLibraryData: RequestType<LibraryDataRequest, LibraryDataResponse> = { method: `${_preFix}/getLibraryData` };
