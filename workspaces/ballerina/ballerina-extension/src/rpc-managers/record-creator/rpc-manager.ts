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
    TypeDataWithReferences
} from "@wso2-enterprise/ballerina-core";
import { StateMachine } from "../../stateMachine";
import path from "path";

export class RecordCreatorRpcManager implements RecordCreatorAPI {
    async convertJsonToRecord(params: JsonToRecordParams): Promise<JsonToRecord> {
        return new Promise(async (resolve) => {
            const response = await StateMachine.langClient().convertJsonToRecord(params) as JsonToRecord;
            resolve(response);
        });
    }

    async convertXMLToRecord(params: XMLToRecordParams): Promise<XMLToRecord> {
        return new Promise(async (resolve) => {
            const response = await StateMachine.langClient().convertXMLToRecord(params) as XMLToRecord;
            resolve(response);
        });
    }

    async convertJsonToRecordType(params: JsonToRecordParams): Promise<TypeDataWithReferences> {
        const projectUri = StateMachine.context().projectUri;
        const filePathUri = path.join(projectUri, 'types.bal');
        return new Promise(async (resolve) => {
            const response = await StateMachine.langClient().convertJsonToRecordType({
                ...params,
                filePathUri
            }) as TypeDataWithReferences;
            resolve(response);
        });
    }

    async convertXmlToRecordType(params: XMLToRecordParams): Promise<TypeDataWithReferences> {
        const projectUri = StateMachine.context().projectUri;
        const filePath = path.join(projectUri, 'types.bal');
        return new Promise(async (resolve) => {
            const response = await StateMachine.langClient().convertXmlToRecordType({
                ...params,
                filePath
            }) as TypeDataWithReferences;
            resolve(response);
        });
    }

}
