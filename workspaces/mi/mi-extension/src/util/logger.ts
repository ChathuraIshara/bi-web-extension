/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';

export const outputChannel = vscode.window.createOutputChannel("Micro Integrator");
export const ERROR_LOG = 'ERROR';
export const INFO_LOG = 'INFO';

function withNewLine(value: string) {
    if (typeof value === 'string' && !value.endsWith('\n')) {
        return value += '\n';
    }
    return value;
}

// This function will log the value to the MI output channel
export function log(value: string): void {
    const output = withNewLine(value);
    console.log(output);
    outputChannel.append(output);
}

export function logWithDebugLevel(message: string, debugLabel: string, logLevel: string): void {
    const formattedMessage = `[${new Date().toLocaleString()}] [${debugLabel}] [${logLevel}] ${message}`;
    const output = withNewLine(formattedMessage);
    console.log(output);
    outputChannel.append(output);
}

export function logDebug(message: string, logLevel: string): void {
    logWithDebugLevel(message, 'MI Debug', logLevel);
}

export function getOutputChannel() {
    return outputChannel;
}

