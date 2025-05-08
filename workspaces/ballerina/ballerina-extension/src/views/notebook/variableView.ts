/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { WebviewViewProvider, WebviewView, WebviewViewResolveContext, CancellationToken, ExtensionContext, Webview } from "vscode";
import { BallerinaExtension, ExtendedLangClient } from "../../core";
// import { CMP_NOTEBOOK, sendTelemetryEvent, TM_EVENT_UPDATE_VARIABLE_VIEW } from "../../features/telemetry";
import { getComposerWebViewOptions, getLibraryWebViewContent, WebViewOptions } from "../../utils";

// let webviewRPCHandler: WebViewRPCHandler;

export class VariableViewProvider implements WebviewViewProvider {

	public static readonly viewType = 'ballerinaViewVariables';
	private ballerinaExtension: BallerinaExtension;

	constructor(extensionInstance: BallerinaExtension) {
		this.ballerinaExtension = extensionInstance;
	}

	public resolveWebviewView(webviewView: WebviewView, _context: WebviewViewResolveContext, _token: CancellationToken) {
		const context = <ExtensionContext>this.ballerinaExtension.context;
		const langClient = <ExtendedLangClient>this.ballerinaExtension.langClient;
		webviewView.webview.options = {
			enableScripts: true,
		};
		// webviewRPCHandler = WebViewRPCHandler.create(webviewView, langClient, []);
		const html = this.getHtmlForWebview(context, langClient, webviewView.webview);
		webviewView.webview.html = html;
	}

	private getHtmlForWebview(_context: ExtensionContext, _langClient: ExtendedLangClient, webView: Webview) {
		const body = `<div id="variables" class="variables-container" />`;
		const bodyCss = "variables";
		const styles = `
			.variables {
				background-color: transparent;
			}
		`;
		const scripts = `
				function loadedScript() {
					const langClient = getLangClient();
					function renderVariableValues() {
						variableView.renderVariableView(document.getElementById("variables"), 
						langClient.getNotebookVariables);
					}
					webViewRPCHandler.addMethod("updateVariableValues", (args) => {
						variableView.updateVariableValues();
						return Promise.resolve({});
					});
					renderVariableValues();
				}
			`;

		const webViewOptions: WebViewOptions = {
			...getComposerWebViewOptions("VariableView", webView),
			body, scripts, styles, bodyCss
		};

		return getLibraryWebViewContent(webViewOptions, webView);
	}

	public updateVariables() {
		//sendTelemetryEvent(this.ballerinaExtension, TM_EVENT_UPDATE_VARIABLE_VIEW, CMP_NOTEBOOK);
		// if (webviewRPCHandler) {
		// 	webviewRPCHandler.invokeRemoteMethod("updateVariableValues", undefined, () => { });
		// }
	}

	public dispose() {
		this.ballerinaExtension.setNotebookVariableViewEnabled(false);
	}
}
