/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PALETTE_COMMANDS } from 'src/features/project';
import * as vscode from 'vscode';
import child_process from 'child_process';
import { CommandResponse } from '@wso2-enterprise/ballerina-core';

export function runCommand(command: PALETTE_COMMANDS, args: any[]) {
    vscode.commands.executeCommand(command, ...args);
}

export async function runBackgroundTerminalCommand(command: string) {
    return new Promise<CommandResponse>(function (resolve) {
        child_process.exec(`${command}`, async (err, stdout, stderr) => {
            if (err) {
                resolve({
                    error: true,
                    message: stderr
                });
            } else {
                resolve({
                    error: false,
                    message: stdout
                });
            }
        });
    });
}

export function openExternalUrl(url:string){
    vscode.env.openExternal(vscode.Uri.parse(url));
}
