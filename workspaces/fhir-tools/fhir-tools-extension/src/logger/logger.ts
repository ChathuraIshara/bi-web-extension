/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { logMessage } from '@wso2-enterprise/fhir-tools-core';

export class Logger {
    private static outputChannel: vscode.OutputChannel;

    public static init(context: vscode.ExtensionContext) {
        this.outputChannel = vscode.window.createOutputChannel(
            'WSO2-FHIR Tools Extension',
        );
        context.subscriptions.push(this.outputChannel);
    }

    private static getTime() {
        return new Date().toLocaleString();
    }

    public static log(logMsg: logMessage, category?: string) {
        const curTime = this.getTime();
        if (category) {
            this.outputChannel.appendLine(
                `[${curTime}] [${logMsg.type}] [${category}] ${logMsg.message}`,
            );
        } else {
            this.outputChannel.appendLine(
                `[${curTime}] [${logMsg.type}] ${logMsg.message}`,
            );
        }
    }

    public static clearLog() {
        this.outputChannel.clear();
    }
}
