/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { type ComponentKind, type Organization, type Project, type WebviewProps, getComponentKey } from "@wso2-enterprise/choreo-core";
import * as vscode from "vscode";
import { ext } from "../extensionVariables";
import { dataCacheStore } from "../stores/data-cache-store";
import { webviewStateStore } from "../stores/webview-state-store";
import { WebViewPanelRpc } from "./WebviewRPC";
import { getUri } from "./utils";

const componentViewMap = new Map<string, ComponentDetailsView>();

class ComponentDetailsView {
	public static currentPanel: ComponentDetailsView | undefined;
	private _panel: vscode.WebviewPanel | undefined;
	private _disposables: vscode.Disposable[] = [];
	private _rpcHandler: WebViewPanelRpc;

	constructor(extensionUri: vscode.Uri, organization: Organization, project: Project, component: ComponentKind, directoryFsPath?: string) {
		this._panel = ComponentDetailsView.createWebview(component);
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
		this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri, organization, project, component, directoryFsPath);
		this._rpcHandler = new WebViewPanelRpc(this._panel);
	}

	private static createWebview(component: ComponentKind): vscode.WebviewPanel {
		const panel = vscode.window.createWebviewPanel(
			`ComponentDetailsView-${component.metadata.name}`,
			component.metadata.displayName,
			vscode.ViewColumn.One,
			{ enableScripts: true, retainContextWhenHidden: true },
		);

		panel.iconPath = vscode.Uri.joinPath(ext.context.extensionUri, "resources", "icons", "choreo-2.svg");

		return panel;
	}

	public getWebview(): vscode.WebviewPanel | undefined {
		return this._panel;
	}

	private _getWebviewContent(
		webview: vscode.Webview,
		extensionUri: vscode.Uri,
		organization: Organization,
		project: Project,
		component: ComponentKind,
		directoryFsPath?: string,
	) {
		// The JS file from the React build output
		const scriptUri = getUri(webview, extensionUri, ["resources", "jslibs", "main.js"]);

		const codiconUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "resources", "codicons", "codicon.css"));

		return /*html*/ `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
              <meta name="theme-color" content="#000000">
              <title>Choreo Webview Wizard</title>
              <link rel="stylesheet" href="${codiconUri}">
              <script src="${scriptUri}"></script>
            </head>
            <body>
              <noscript>You need to enable JavaScript to run this app.</noscript>
              <div id="root"></div>
            </body>
            <script>
              function render() {
                choreoWebviews.renderChoreoWebViews(
                  document.getElementById("root"),
                  ${JSON.stringify({
										type: "ComponentDetailsView",
										directoryFsPath,
										organization,
										project,
										component,
										initialEnvs: dataCacheStore.getState().getEnvs(organization.handle, project.handler),
									} as WebviewProps)}
                );
              }
              render();
            </script>
          </html>
        `;
	}

	public dispose() {
		ComponentDetailsView.currentPanel = undefined;
		this._panel?.dispose();

		while (this._disposables.length) {
			const disposable = this._disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}

		this._panel = undefined;
	}
}

const getComponentDetailsView = (orgHandle: string, projectHandle: string, component: string): vscode.WebviewPanel | undefined => {
	const componentKey = `${orgHandle}-${projectHandle}-${component}`;
	return componentViewMap.get(componentKey)?.getWebview();
};

export const closeComponentDetailsView = (orgHandle: string, projectHandle: string, component: string): void => {
	const webView = getComponentDetailsView(orgHandle, projectHandle, component);
	if (webView) {
		webView.dispose();
		componentViewMap.delete(`${orgHandle}-${projectHandle}-${component}`);
	}
};

export const showComponentDetailsView = (
	org: Organization,
	project: Project,
	component: ComponentKind,
	directoryFsPath: string,
	viewColumn?: vscode.ViewColumn,
) => {
	const webView = getComponentDetailsView(org.handle, project.handler, component.metadata.name);
	const componentKey = getComponentKey(org, project, component);

	if (webView) {
		webView?.reveal(viewColumn);
	} else {
		webviewStateStore.getState().onCloseComponentDrawer(getComponentKey(org, project, component));
		const componentDetailsView = new ComponentDetailsView(ext.context.extensionUri, org, project, component, directoryFsPath);
		componentDetailsView.getWebview()?.reveal(viewColumn);
		componentViewMap.set(componentKey, componentDetailsView);

		webviewStateStore.getState().setOpenedComponentKey(componentKey ?? "");
		componentDetailsView.getWebview()?.onDidChangeViewState((event) => {
			if (event.webviewPanel.active) {
				webviewStateStore.getState().setOpenedComponentKey(componentKey ?? "");
			} else {
				webviewStateStore.getState().onCloseComponentView(componentKey);
			}
		});
		componentDetailsView.getWebview()?.onDidDispose(() => {
			webviewStateStore.getState().onCloseComponentView(componentKey);
		});
	}
};
