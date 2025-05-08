/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DebugProtocol } from "vscode-debugprotocol";

export interface AttachRequestArguments extends DebugProtocol.AttachRequestArguments {
    host: string;
    port: number;
    script: string;
}

export interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
    script: string;
    scriptArguments: Array<string>;
    programArgs: Array<string>;
    commandOptions: Array<string>;
    'ballerina.home': string;
    debugTests: boolean;
    networkLogs: Boolean;
    networkLogsPort: number;
    port: number;
    env: Map<string, string>;
}
