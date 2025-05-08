/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Webview } from 'vscode';
import { getLibraryWebViewContent, WebViewOptions, getComposerWebViewOptions } from '../../utils';

export function render(data: any, webView: Webview)
    : string {

    const body = `<div id="graphql-view" class="graphql-container"><div class="loader" /></div>`;
    const bodyCss = "graphql";
    const styles = `
        .loader {
            border: 3px solid var(--vscode-editor-background);
            border-top: 3px solid var(--vscode-button-background);
            border-radius: 50%;
            width: 28px;
            height: 28px;
            animation: spin 1s linear infinite;
            margin: auto;
            margin-top: 38%;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        body {
            padding: 0;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
    `;
    const scripts = `
             function loadedScript() {
                window.Graphql.renderGraphql(${JSON.stringify(data)});
             }
         `;
    const webViewOptions: WebViewOptions = {
        ...getComposerWebViewOptions("Graphql", webView), body, scripts, styles, bodyCss,
    };

    return getLibraryWebViewContent(webViewOptions, webView);
}
