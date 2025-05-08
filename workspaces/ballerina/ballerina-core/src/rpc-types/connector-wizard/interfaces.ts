/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { BallerinaConnectorInfo, BallerinaConnectorsRequest, BallerinaConnector } from "../../interfaces/ballerina";

export interface ConnectorRequest {
    id?: string
    orgName?: string
    packageName?: string
    moduleName?: string
    version?: string
    name?: string
    targetFile?: string
}

export interface ConnectorResponse extends BallerinaConnectorInfo {
    error?: string;
}

export interface ConnectorsRequest extends BallerinaConnectorsRequest {
    error?: string;
}

export interface ConnectorsResponse {
    central: BallerinaConnector[];
    local?: BallerinaConnector[];
    error?: string;
}
