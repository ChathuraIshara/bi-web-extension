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
import { TestManagerServiceAPI, GetTestFunctionRequest, AddOrUpdateTestFunctionRequest, 
    TestSourceEditResponse, GetTestFunctionResponse, 
    getTestFunction, addTestFunction, updateTestFunction,  
    SourceUpdateResponse} from "@wso2-enterprise/ballerina-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class TestManagerServiceRpcClient implements TestManagerServiceAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    getTestFunction(params: GetTestFunctionRequest): Promise<GetTestFunctionResponse> {
        return this._messenger.sendRequest(getTestFunction, HOST_EXTENSION, params);
    }

    addTestFunction(params: AddOrUpdateTestFunctionRequest): Promise<SourceUpdateResponse> {
        return this._messenger.sendRequest(addTestFunction, HOST_EXTENSION, params);
    }

    updateTestFunction(params: AddOrUpdateTestFunctionRequest): Promise<SourceUpdateResponse> {
        return this._messenger.sendRequest(updateTestFunction, HOST_EXTENSION, params);
    }
}

