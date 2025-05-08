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
import * as vscode from "vscode";
import { ResponseError } from "vscode-jsonrpc";
import { ErrorCode } from "../choreo-rpc/constants";
import { ext } from "../extensionVariables";
import { getLogger } from "../logger/logger";
import { authStore } from "../stores/auth-store";
import { isRpcActive, setExtensionName } from "./cmd-utils";

export function signInWithAuthCodeCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(CommandIds.SignInWithAuthCode, async (params: ICmdParamsBase) => {
			setExtensionName(params?.extName);
			try {
				isRpcActive(ext);
				// This is used in the extension test runner to sign into choreo
				getLogger().debug("Signing in to WSO2 Platform using code");

				const authCode = await vscode.window.showInputBox({
					prompt: "Enter Authentication Code: ",
					placeHolder: "Code",
					ignoreFocusOut: true,
				});

				if (authCode) {
					ext.clients.rpcClient.signInWithAuthCode(authCode).then((userInfo) => {
						if (userInfo) {
							authStore.getState().loginSuccess(userInfo);
						}
					});
				} else {
					window.showErrorMessage("Auth Code is required to login");
				}
			} catch (error: any) {
				if (!(error instanceof ResponseError) || ![ErrorCode.NoOrgsAvailable, ErrorCode.NoAccountAvailable].includes(error.code)) {
					window.showErrorMessage("Sign in failed. Please check the logs for more details.");
				}
				getLogger().error(`WSO2 Platform sign in Failed: ${error.message}`);
			}
		}),
	);
}
