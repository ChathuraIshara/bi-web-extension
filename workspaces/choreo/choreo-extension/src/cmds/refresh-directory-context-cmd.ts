/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CommandIds } from "@wso2-enterprise/choreo-core";
import { type ExtensionContext, commands } from "vscode";
import { authStore } from "../stores/auth-store";
import { contextStore } from "../stores/context-store";

export function refreshContextCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(CommandIds.RefreshDirectoryContext, async () => {
			const userInfo = authStore.getState().state.userInfo;
			if (!userInfo) {
				throw new Error("You are not logged in. Please log in and retry.");
			}

			await contextStore.getState().refreshState();
		}),
	);
}
