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
    AddArrayElementRequest,
    InlineDataMapperModelRequest,
    InlineDataMapperSourceRequest,
    VisualizableFieldsRequest,
    addNewArrayElement,
    getDataMapperModel,
    getDataMapperSource,
    getVisualizableFields
} from "@wso2-enterprise/ballerina-core";
import { Messenger } from "vscode-messenger";
import { InlineDataMapperRpcManager } from "./rpc-manager";

export function registerInlineDataMapperRpcHandlers(messenger: Messenger) {
    const rpcManger = new InlineDataMapperRpcManager();
    messenger.onRequest(getDataMapperModel, (args: InlineDataMapperModelRequest) => rpcManger.getDataMapperModel(args));
    messenger.onRequest(getDataMapperSource, (args: InlineDataMapperSourceRequest) => rpcManger.getDataMapperSource(args));
    messenger.onRequest(getVisualizableFields, (args: VisualizableFieldsRequest) => rpcManger.getVisualizableFields(args));
    messenger.onRequest(addNewArrayElement, (args: AddArrayElementRequest) => rpcManger.addNewArrayElement(args));
}
