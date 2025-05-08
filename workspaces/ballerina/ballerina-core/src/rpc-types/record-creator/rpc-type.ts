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
import { JsonToRecord, JsonToRecordParams, XMLToRecord, XMLToRecordParams, TypeDataWithReferences } from "../../interfaces/extended-lang-client";
import { RequestType } from "vscode-messenger-common";

const _preFix = "record-creator";
export const convertJsonToRecord: RequestType<JsonToRecordParams, JsonToRecord> = { method: `${_preFix}/convertJsonToRecord` };
export const convertXMLToRecord: RequestType<XMLToRecordParams, XMLToRecord> = { method: `${_preFix}/convertXMLToRecord` };
export const convertJsonToRecordType: RequestType<JsonToRecordParams, TypeDataWithReferences> = { method: `${_preFix}/convertJsonToRecordType` };
export const convertXmlToRecordType: RequestType<XMLToRecordParams, TypeDataWithReferences> = { method: `${_preFix}/convertXmlToRecordType` };
