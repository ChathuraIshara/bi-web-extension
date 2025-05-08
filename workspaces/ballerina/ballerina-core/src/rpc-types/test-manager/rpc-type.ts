/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import { GetTestFunctionRequest, GetTestFunctionResponse, AddOrUpdateTestFunctionRequest } from "../../interfaces/extended-lang-client";
import { RequestType } from "vscode-messenger-common";
import { SourceUpdateResponse } from "../service-designer/interfaces";

const _preFix = "test-manager";
export const getTestFunction: RequestType<GetTestFunctionRequest, GetTestFunctionResponse> = 
{ method: `${_preFix}/getTestFunction` };
export const addTestFunction: RequestType<AddOrUpdateTestFunctionRequest, SourceUpdateResponse> = 
{ method: `${_preFix}/addTestFunction` };
export const updateTestFunction: RequestType<AddOrUpdateTestFunctionRequest, SourceUpdateResponse> = 
{ method: `${_preFix}/updateTestFunction` };
