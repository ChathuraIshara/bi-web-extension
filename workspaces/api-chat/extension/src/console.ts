/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { Uri, Webview } from "vscode";
import { messenger } from './WebviewRPC';
import { setOpenAPI } from './TestEngine';
import { parse } from 'yaml';
import { clearLogs, refresh, reset } from './TestEngine';



export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {

    if (process.env.WEB_VIEW_DEV_MODE === "true" && process.env.WEB_VIEW_DEV_HOST !== undefined) {
        return `${process.env.WEB_VIEW_DEV_HOST}`;
    }

    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

class Console {

    public static currentPanel: Console | undefined;
    // private static _rpcHandler: WebViewPanelRpc;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        this._panel.onDidChangeViewState(e => {
            if (e.webviewPanel.visible) {
                //
            }
        });
    }

    public static render(extensionUri: vscode.Uri, fileName: string) {
        if (Console.currentPanel) {
            const panel = Console.currentPanel._panel;
            Console.currentPanel = new Console(panel, extensionUri);
            panel.reveal(vscode.ViewColumn.Two);
            panel.title = "API Chat - " + fileName;
        } else {
            const panel = vscode.window.createWebviewPanel("APIChatConsole", "API Chat - " + fileName, vscode.ViewColumn.Two, {
                enableScripts: true, retainContextWhenHidden: true
            });
            panel.iconPath = vscode.Uri.joinPath(extensionUri, "resources", "images", "apichat.svg");
            messenger.registerWebviewPanel(panel);
            Console.currentPanel = new Console(panel, extensionUri);
        }
    }

    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
        // The JS file from the React build output
        const scriptUri = getUri(webview, extensionUri, [
            "resources",
            "jslibs",
            "main.js"
        ]);

        const codiconUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "resources", "codicons", "codicon.css"));

        return /*html*/ `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
              <meta name="theme-color" content="#000000">
              <title>api-chat</title>
              <link rel="stylesheet" href="${codiconUri}">
              <style>
                body {
                  padding: 0;
                  height:100vh;
                }
              </style>             
              <script src="${scriptUri}"></script>
            </head>
            <body>
              <noscript>You need to enable JavaScript to run this app.</noscript>
              <div id="root"></div>
            </body>
            <script>
              function render() {
                APIChatConsole.renderConsole(
                  document.getElementById("root"), 
                  "ProjectOverview", 
                );
              }
              render();
            </script>
          </html>
        `;
    }

    public dispose() {
        Console.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}


export function activateConsole(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('api-chat.console', () => {
            const activeDocument = vscode.window.activeTextEditor?.document;
            if (activeDocument) {
                const filePath = activeDocument.fileName;
                const fileName = filePath.split('/').pop();
                Console.render(context.extensionUri, fileName || '');
                if (activeDocument) {

                    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
                        // Parse the YAML file
                        const yamlContent = activeDocument.getText();
                        const parsedYaml = parse(yamlContent);
                        reset();
                        setOpenAPI(parsedYaml);
                    }
                    if (filePath.endsWith('.json')) {
                        // Parse the YAML file
                        const jsonContent = activeDocument.getText();
                        try {
                            const jsonObject = JSON.parse(jsonContent);
                            reset();
                            setOpenAPI(jsonObject);
                        } catch (error: any) {
                            vscode.window.showErrorMessage('Error parsing JSON: ' + error.message);
                        }
                    }
                }
            }
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('api-chat.clear', () => {
            clearLogs();
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('api-chat.refresh', () => {
            refresh();
        })
    );
}

