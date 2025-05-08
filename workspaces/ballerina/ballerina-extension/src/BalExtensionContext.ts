
/*
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ExtensionContext } from "vscode";
import { AgentChatContext } from "./views/agent-chat/activate";
import { AIPanelPrompt } from "@wso2-enterprise/ballerina-core";
import { WebExtendedLanguageClient } from "./web-activators/webExtendedLanguageClient";
import { BalFileSystemProvider } from "./web-activators/fs/BalFileSystemProvider";

export class BalExtensionContext {
    public context!: ExtensionContext;
    public aiChatDefaultPrompt?: AIPanelPrompt;
    public agentChatContext?: AgentChatContext;
    public hasPullModuleNotification = false;
    public hasPullModuleResolved = false;
    //web config
    public isWebMode?:boolean;
}

export const extension = new BalExtensionContext();
