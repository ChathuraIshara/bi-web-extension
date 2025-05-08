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
    JsonToRecordParams,
    XMLToRecordParams,
    convertJsonToRecord,
    convertJsonToRecordType,
    convertXMLToRecord,
    convertXmlToRecordType
} from "@wso2-enterprise/ballerina-core";
import { Messenger } from "vscode-messenger";
import { RecordCreatorRpcManager } from "./rpc-manager";

export function registerRecordCreatorRpcHandlers(messenger: Messenger) {
    const rpcManger = new RecordCreatorRpcManager();
    messenger.onRequest(convertJsonToRecord, (args: JsonToRecordParams) => rpcManger.convertJsonToRecord(args));
    messenger.onRequest(convertXMLToRecord, (args: XMLToRecordParams) => rpcManger.convertXMLToRecord(args));
    messenger.onRequest(convertJsonToRecordType, (args: JsonToRecordParams) => rpcManger.convertJsonToRecordType(args));
    messenger.onRequest(convertXmlToRecordType, (args: XMLToRecordParams) => rpcManger.convertXmlToRecordType(args));
}
