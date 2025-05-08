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

let sequenceWizardWebview: WebviewPanel | undefined;

export function createSequenceWizardWebview(context: ExtensionContext) {
    if (sequenceWizardWebview && sequenceWizardWebview.active) {
        sequenceWizardWebview.reveal();
        return;
    }

    // Create a new webview panel
    const panel = window.createWebviewPanel(
        'diagram',
        'Micro Integrator Sequence Wizard',
        ViewColumn.Active,
        {
            enableScripts: true,
            localResourceRoots: [Uri.file(path.join(context.extensionPath, 'resources'))]
        }
    );
    sequenceWizardWebview = panel;

    const scripts = getComposerJSFiles(context, 'MIDiagram', panel.webview).map(jsFile =>
        '<script charset="UTF-8" src="' + jsFile + '"></script>').join('\n');

    // const rpc = new RegisterWebViewPanelRpc(context, panel);

    // const refreshDiagram = debounce(() => {
    //     if (sequenceWizardWebview) {
    //         rpc.getMessenger().sendNotification(onFileContentUpdate, { type: 'webview', webviewType: 'diagram' });
    //     }
    // }, 500);


    // workspace.onDidChangeTextDocument(function() {
    //     refreshDiagram();
    // }, context);

    sequenceWizardWebview.onDidDispose(() => {
        sequenceWizardWebview = undefined;
    });

    panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
                    <meta name="theme-color" content="#000000">
                    <title>Micro Integrator Sequence Wizard</title>
                </head>
                <body>
                    <noscript>You need to enable JavaScript to run this app.</noscript>
                    <div id="mi-sequence-wizard-container"></div>
                </body>
                ${scripts}
                <script>
                    function render() {
                        MIDiagram.renderSequenceWizard(
							document.getElementById("root")
						);
                    }
                    render();
                </script>
            </html>
          `;
}
