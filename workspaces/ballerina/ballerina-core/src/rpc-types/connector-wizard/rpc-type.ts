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
import { ConnectorRequest, ConnectorResponse, ConnectorsRequest, ConnectorsResponse } from "./interfaces";
import { RequestType } from "vscode-messenger-common";

const _preFix = "connector-wizard";
export const getConnector: RequestType<ConnectorRequest, ConnectorResponse> = { method: `${_preFix}/getConnector` };
export const getConnectors: RequestType<ConnectorsRequest, ConnectorsResponse> = { method: `${_preFix}/getConnectors` };
