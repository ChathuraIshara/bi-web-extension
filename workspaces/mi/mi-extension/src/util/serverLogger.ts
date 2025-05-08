/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';

export const outputServerChannel = vscode.window.createOutputChannel("Micro Integrator Server");

export function showServerOutputChannel() {
    outputServerChannel.show(true);
}

// This function will log the value to the MI server output channel
export function serverLog(value: string): void {
    console.log(value);
    outputServerChannel.append(value);
}

export function getOutputChannel() {
    return outputServerChannel;
}

