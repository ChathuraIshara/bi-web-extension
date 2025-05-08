/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as path from 'path';
import { ExtensionContext, Uri, ViewColumn, Webview, WebviewPanel, window, workspace } from 'vscode';
import { debounce } from "lodash";
import { getComposerJSFiles } from '../util';

let apiWizardWebview: WebviewPanel | undefined;

export function createApiWizardWebview(context: ExtensionContext) {
    if (apiWizardWebview && apiWizardWebview.active) {
        apiWizardWebview.reveal();
        return;
    }

    // Create a new webview panel
    const panel = window.createWebviewPanel(
        'diagram',
        'Micro Integrator API Wizard',
        ViewColumn.Active,
        {
            enableScripts: true,
            localResourceRoots: [Uri.file(path.join(context.extensionPath, 'resources'))]
        }
    );
    apiWizardWebview = panel;

    const scripts = getComposerJSFiles(context, 'MIDiagram', panel.webview).map(jsFile =>
        '<script charset="UTF-8" src="' + jsFile + '"></script>').join('\n');

    // const rpc = new RegisterWebViewPanelRpc(context, panel);

    // const refreshDiagram = debounce(() => {
    //     if (apiWizardWebview) {
    //         rpc.getMessenger().sendNotification(refresh, { type: 'webview', webviewType: 'diagram' });
    //     }
    // }, 500);


    // workspace.onDidChangeTextDocument(function() {
    //     refreshDiagram();
    // }, context);

    apiWizardWebview.onDidDispose(() => {
        apiWizardWebview = undefined;
    });

    panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
                    <meta name="theme-color" content="#000000">
                    <title>Micro Integrator API Wizard</title>
                </head>
                <body>
                    <noscript>You need to enable JavaScript to run this app.</noscript>
                    <div id="mi-api-wizard-container"></div>
                </body>
                ${scripts}
                <script>
                    function render() {
                        MIDiagram.renderAPIWizard(
							document.getElementById("root")
						);
                    }
                    render();
                </script>
            </html>
          `;
}
