/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CommandIds } from "@wso2-enterprise/wso2-platform-core";
import { type ExtensionContext, commands, window } from "vscode";
import { ext } from "../extensionVariables";
import { getLogger } from "../logger/logger";
import { authStore } from "../stores/auth-store";
import { isRpcActive } from "./cmd-utils";

export function signOutCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(CommandIds.SignOut, async () => {
			try {
				isRpcActive(ext);
				getLogger().debug("Signing out from WSO2 Platform");
				authStore.getState().logout();
				window.showInformationMessage("Successfully signed out from WSO2 Platform!");
			} catch (error: any) {
				getLogger().error(`Error while signing out from WSO2 Platform. ${error?.message}${error?.cause ? `\nCause: ${error.cause.message}` : ""}`);
				if (error instanceof Error) {
					window.showErrorMessage(error.message);
				}
			}
		}),
	);
}
