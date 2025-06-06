/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { Uri, ViewColumn } from 'vscode';
import { getComposerJSFiles } from '../util';
import { RPCLayer } from '../RPCLayer';
import { extension } from '../MIExtensionContext';
import { SwaggerData } from '@wso2-enterprise/mi-core';

export class SwaggerWebview {
    public static currentPanel: SwaggerWebview | undefined;
    public static readonly viewType = 'micro-integrator.swagger-panel';
    private _panel: vscode.WebviewPanel | undefined;
    private _disposables: vscode.Disposable[] = [];
    private _port: number;;
    private _spec: any;

    constructor(data: SwaggerData) {
        this._spec = data.generatedSwagger;
        this._port = data.port;
        this._panel = SwaggerWebview.createWebview();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this.getWebviewContent(this._panel.webview);
        RPCLayer.create(this._panel);
    }


    private static createWebview(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            SwaggerWebview.viewType,
            "Swagger View",
            ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [Uri.file(path.join(extension.context.extensionPath, 'resources'))], // TODO: check the correct one
                retainContextWhenHidden: true,
            }
        );
        return panel;
    }

    public getWebview(): vscode.WebviewPanel | undefined {
        return this._panel;
    }

    private getWebviewContent(webview: vscode.Webview) {
        const swaggerSpec: SwaggerData = {
            generatedSwagger: this._spec,
            port: this._port
        };

        // The JS file from the React build output
        const scriptUri = getComposerJSFiles(extension.context, 'Visualizer', webview).map(jsFile =>
            '<script charset="UTF-8" src="' + jsFile + '"></script>').join('\n');

        // const codiconUri = webview.asWebviewUri(Uri.joinPath(extension.context.extensionUri, "resources", "codicons", "codicon.css"));
        // const fontsUri = webview.asWebviewUri(Uri.joinPath(extension.context.extensionUri, "node_modules", "@wso2-enterprise", "font-wso2-vscode", "dist", "wso2-vscode.css"));

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <title>Micro Integrator</title>
         
          <style>
            body, html, #root {
                height: 100%;
                margin: 0;
                padding: 0px;
                overflow: hidden;
            }
          </style>
          ${scriptUri}
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">
                Loading ....
            </div>
            <script>
            function render() {
                visualizerWebview.renderWebview(
                    document.getElementById("root"), "swagger", ${JSON.stringify(swaggerSpec)}
                );
            }
            render();
        </script>
        </body>
        </html>
      `;
    }

    public dispose() {
        SwaggerWebview.currentPanel = undefined;
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
