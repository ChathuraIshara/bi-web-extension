/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { SHARED_COMMANDS } from '@wso2-enterprise/ballerina-core';
import { BallerinaExtension } from '../../core';
import { ChatPanel } from './webview';

export interface AgentChatContext {
    chatEp: string;
    chatSessionId: string;
}

export function activateAgentChatPanel(ballerinaExtInstance: BallerinaExtension) {
    ballerinaExtInstance.context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.OPEN_AGENT_CHAT, (agentChatContext: AgentChatContext) => {
            if (
                !agentChatContext.chatEp || typeof agentChatContext.chatEp !== 'string' ||
                !agentChatContext.chatSessionId || typeof agentChatContext.chatSessionId !== 'string'
            ) {
                vscode.window.showErrorMessage('Invalid Agent Chat Context: Missing or incorrect ChatEP or ChatSessionID!');
                return;
            }

            ChatPanel.render(agentChatContext);
        })
    );
}
