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
    JsonToRecord,
    JsonToRecordParams,
    RecordCreatorAPI,
    XMLToRecord,
    XMLToRecordParams,
    convertJsonToRecord,
    convertXMLToRecord,
    convertJsonToRecordType,
    convertXmlToRecordType,
    TypeDataWithReferences
} from "@wso2-enterprise/ballerina-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class RecordCreatorRpcClient implements RecordCreatorAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    convertJsonToRecord(params: JsonToRecordParams): Promise<JsonToRecord> {
        return this._messenger.sendRequest(convertJsonToRecord, HOST_EXTENSION, params);
    }

    convertXMLToRecord(params: XMLToRecordParams): Promise<XMLToRecord> {
        return this._messenger.sendRequest(convertXMLToRecord, HOST_EXTENSION, params);
    }

    convertJsonToRecordType(params: JsonToRecordParams): Promise<TypeDataWithReferences> {
        return this._messenger.sendRequest(convertJsonToRecordType, HOST_EXTENSION, params);
    }

    convertXmlToRecordType(params: XMLToRecordParams): Promise<TypeDataWithReferences> {
        return this._messenger.sendRequest(convertXmlToRecordType, HOST_EXTENSION, params);
    }
}
