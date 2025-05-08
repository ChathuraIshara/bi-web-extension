/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Uri, type Webview } from "vscode";
import * as vscode from "vscode";
import { ProjectActivityView } from "./ProjectActivityView";

export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
	if (shouldUseWebViewDevMode(pathList)) {
		return process.env.WEB_VIEW_DEV_HOST;
	}
	return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

function shouldUseWebViewDevMode(pathList: string[]): boolean {
	return pathList[pathList.length - 1] === "main.js" && process.env.WEB_VIEW_DEV_MODE === "true" && process.env.WEB_VIEW_DEV_HOST !== undefined;
}

export function activateActivityWebViews(context: vscode.ExtensionContext) {
	const projectActivityViewProvider = new ProjectActivityView(context.extensionUri);

	context.subscriptions.push(vscode.window.registerWebviewViewProvider(ProjectActivityView.viewType, projectActivityViewProvider));
}
