/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { Uri } from "vscode";
import { messenger } from '../webRPCRegister';
import { getUri, setWebViewActiveContext } from '../utils';
import { ext } from '../fhirToolsExtentionContext';

export class WebView {
    public static currentPanel: WebView | undefined;
    private _panel: vscode.WebviewPanel | undefined;
    private _disposables: vscode.Disposable[] = [];
    private outputData: string;
    private curState: string;

    constructor() {
        this._panel = WebView.createWebview();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this.getWebviewContent(this._panel.webview);
        this._panel.onDidChangeViewState( () => {
            setWebViewActiveContext(this._panel.active && this.curState === 'DisplayOutput');
        });
    }

    private static createWebview(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'FHIRToolsWebview',
            'FHIR Tools',
            vscode.ViewColumn.Beside,
            { enableScripts: true, retainContextWhenHidden: true}
        );
        panel.iconPath = Uri.joinPath(ext.context.extensionUri, 'resources', 'images', 'fhir.svg');
        messenger.registerWebviewPanel(panel);
        return panel;
    }

    public getWebview(): vscode.WebviewPanel | undefined {
        return this._panel;
    }

    public setState(state: string) {
        if (state === "DisplayOutput"){
            setWebViewActiveContext(this._panel.active);
        } else{
            setWebViewActiveContext(false);
        }
        this.curState = state;
    }

    public setOutputData(data: string) {
        this.outputData = data;
    }

    public static getOutputData(): string {
        return this.currentPanel?.outputData;
    }

    public static isPanelActive(): boolean {
        return this.currentPanel !== undefined;
    }

    private getWebviewContent(webview: vscode.Webview) {
        // The JS file from the React build output
        const scriptUri = getUri(webview, ext.context.extensionUri, [
            "resources",
            "jslibs",
            "Visualizer.js"
        ]);

        const fontsUri = webview.asWebviewUri(Uri.joinPath(ext.context.extensionUri, "node_modules", "@wso2-enterprise", "font-wso2-vscode", "dist", "wso2-vscode.css"));

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <title>FHIR Tools Overview</title>
          <link rel="stylesheet" href="${fontsUri}">
          <script src="${scriptUri}"></script>
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">
                Loading ....
            </div>
            <script>
            function render() {
                visualizerWebview.renderWebview(
                    document.getElementById("root"), "lowcode"
                );
            }
            render();
        </script>
        </body>
        </html>
      `;
    }

    public dispose() {
        WebView.currentPanel = undefined;
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
