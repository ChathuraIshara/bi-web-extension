/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Webview } from "vscode";
import { getComposerWebViewOptions, getLibraryWebViewContent, WebViewOptions } from "../../utils/webview-utils";

export function render(webView: Webview, selectedRecord: string) {
    const body = `<div class = "container" id = "webview-container" />`;
    const bodyCss = ``;
    const styles = `
        .container {
            background-color: white;
            height: 100%;
            overflow: hidden;
            width: 100%;
        }
    `;
    const scripts = `
        function loadedScript() {
            window.addEventListener('message', event => {
                let msg = event.data;
                switch(msg.command){
                    case 'refresh':
                        renderDiagrams();
                }
            });

            function getPersistModel() {
                return new Promise((resolve, _reject) => {
                    webViewRPCHandler.invokeRemoteMethod(
                        'getPersistERModel',
                        [],
                        (response) => {
                            resolve(response);
                        }
                    );
                })
            }

            function showProblemPanel() {
                return new Promise((resolve, _reject) => {
                    webViewRPCHandler.invokeRemoteMethod(
                        'showProblemPanel',
                        [],
                        (response) => {
                            resolve(response);
                        }
                    );
                })
            }

            function renderDiagrams() {
                persistDiagram.renderDiagram(
                    getPersistModel,
                    "${selectedRecord}",
                    showProblemPanel,
                    document.getElementById("webview-container")
                );
            }

            renderDiagrams();
        }
    `;

    const webViewOptions: WebViewOptions = {
        ...getComposerWebViewOptions("PersistDiagram", webView),
        body, scripts, styles, bodyCss
    };

    return getLibraryWebViewContent(webViewOptions, webView);
}
