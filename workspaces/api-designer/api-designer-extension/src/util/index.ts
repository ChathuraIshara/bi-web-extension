/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as path from 'path';
import { ExtensionContext, Uri, Webview } from "vscode";

const isDevMode = process.env.WEB_VIEW_WATCH_MODE === "true";

export function getComposerJSFiles(context: ExtensionContext, componentName: string, webView: Webview): string[] {
	const filePath = path.join(context.extensionPath, 'resources', 'jslibs', componentName + '.js');
	return [
		isDevMode ? path.join(process.env.WEB_VIEW_DEV_HOST!, componentName + '.js')
			: webView.asWebviewUri(Uri.file(filePath)).toString(),
		isDevMode ? 'http://localhost:8097' : '' // For React Dev Tools
	];
}
