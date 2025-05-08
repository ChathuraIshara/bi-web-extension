/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CommandIds, type ICmdParamsBase } from "@wso2-enterprise/wso2-platform-core";
import { type ExtensionContext, commands, window } from "vscode";
import { ext } from "../extensionVariables";
import { authStore } from "../stores/auth-store";
import { contextStore } from "../stores/context-store";
import { isRpcActive, setExtensionName } from "./cmd-utils";

export function refreshContextCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(CommandIds.RefreshDirectoryContext, async (params: ICmdParamsBase) => {
			try {
				isRpcActive(ext);
				setExtensionName(params?.extName);
				const userInfo = authStore.getState().state.userInfo;
				if (!userInfo) {
					throw new Error("You are not logged in. Please log in and retry.");
				}

				await contextStore.getState().refreshState();
			} catch (err: any) {
				console.error("Failed to refresh directory context", err);
				window.showErrorMessage(err?.message || "Failed to refresh directory context");
			}
		}),
	);
}
