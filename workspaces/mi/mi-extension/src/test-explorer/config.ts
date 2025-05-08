
/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';

export class TestRunnerConfig {
    private static serverPort: number = vscode.workspace.getConfiguration().get<number>('MI.test.serverPort', 9008);
    private static host: string = vscode.workspace.getConfiguration().get<string>('MI.test.server', 'localhost');

    public static getServerPort(): number {
        return this.serverPort;
    }

    public static getHost(): string {
        return this.host;
    }
}
