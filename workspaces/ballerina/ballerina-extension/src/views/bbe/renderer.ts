/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ExtendedLangClient } from '../../core/extended-language-client';
import { ExtensionContext, Webview } from 'vscode';
import { getLibraryWebViewContent, WebViewOptions, getComposerWebViewOptions } from '../../utils';

export function render(_context: ExtensionContext, _langClient: ExtendedLangClient, webView: Webview)
    : string {

    const body = `<div id="examples" class="examples-container" />`;
    const bodyCss = "examples";
    const styles = ``;
    const scripts = `
            function loadedScript() {
                    function openExample(url) {
                        webViewRPCHandler.invokeRemoteMethod("openExample", [url]);
                    }
                    const langClient = getLangClient();
                    function renderSamples() {
                        BBEViewer.renderSamplesList(document.getElementById("examples"), openExample,
                        langClient.getExamples, () => {});
                    }
                    renderSamples();
            }
        `;

    const webViewOptions: WebViewOptions = {
        ...getComposerWebViewOptions("BBEViewer", webView),
        body, scripts, styles, bodyCss
    };

    return getLibraryWebViewContent(webViewOptions, webView, "", "");
}

