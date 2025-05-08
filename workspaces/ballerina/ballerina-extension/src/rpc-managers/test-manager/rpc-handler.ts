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
import { addTestFunction, getTestFunction, GetTestFunctionRequest, 
    AddOrUpdateTestFunctionRequest, updateTestFunction } from "@wso2-enterprise/ballerina-core";
import { Messenger } from "vscode-messenger";
import { TestServiceManagerRpcManager } from "./rpc-manager";

export function registerTestManagerRpcHandlers(messenger: Messenger) {
    const rpcManger = new TestServiceManagerRpcManager();
    messenger.onRequest(getTestFunction, (args: GetTestFunctionRequest) => rpcManger.getTestFunction(args));
    messenger.onRequest(addTestFunction, (args: AddOrUpdateTestFunctionRequest) => rpcManger.addTestFunction(args));
    messenger.onRequest(updateTestFunction, (args: AddOrUpdateTestFunctionRequest) => rpcManger.updateTestFunction(args));
}

