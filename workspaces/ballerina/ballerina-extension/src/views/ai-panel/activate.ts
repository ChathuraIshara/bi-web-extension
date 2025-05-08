/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { AIPanelPrompt, SHARED_COMMANDS } from '@wso2-enterprise/ballerina-core';
import { closeAIWebview, openAIWebview } from './aiMachine';
import { extension } from '../../BalExtensionContext';
import { BallerinaExtension } from '../../core';
import { notifyAiWebview } from '../../RPCLayer';

export function activateAiPanel(ballerinaExtInstance: BallerinaExtension) {
    ballerinaExtInstance.context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.OPEN_AI_PANEL, (defaultPrompt?: AIPanelPrompt) => {
            openAIWebview(defaultPrompt);
        })
    );
    ballerinaExtInstance.context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.CLOSE_AI_PANEL, () => {
            closeAIWebview();
        })
    );
    ballerinaExtInstance.context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.CLEAR_AI_PROMPT, () => {
            extension.aiChatDefaultPrompt = undefined;
        })
    );
    ballerinaExtInstance.context.subscriptions.push(
        vscode.window.onDidChangeActiveColorTheme((event) => {
            notifyAiWebview();
        })
    );
    console.log("AI Panel activated");
}
