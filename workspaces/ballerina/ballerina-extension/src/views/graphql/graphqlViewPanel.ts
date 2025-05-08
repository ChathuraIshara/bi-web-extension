/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ViewColumn, window, WebviewPanel, Uri } from "vscode";
import { getCommonWebViewOptions } from '../../utils';
import { render } from './render';
import { ballerinaExtInstance, ExtendedLangClient } from "../../core";
import { SwaggerServer } from "./server";
// import { CMP_TRYIT_GRAPHQL_VIEW, sendTelemetryEvent, TM_EVENT_GRAPHQL_RUN } from "../../features/telemetry";
import path from "path";
import { extension } from "../../BalExtensionContext";


let graphqlViewPanel: WebviewPanel | undefined;

export async function showGraphqlView(serviceAPI: string): Promise<void> {
    if (graphqlViewPanel) {
        graphqlViewPanel.dispose();
    }

    // Create and show a new GraphqlView
    graphqlViewPanel = window.createWebviewPanel(
        'ballerinaGraphql',
        `Graphql Try It`,
        { viewColumn: ViewColumn.Active, preserveFocus: true },
        getCommonWebViewOptions()
    );

    graphqlViewPanel.iconPath = {
        dark: Uri.file(path.join(extension.context.extensionPath, 'resources', 'icons', 'dark-bi-graphql.svg')),
        light: Uri.file(path.join(extension.context.extensionPath, 'resources', 'icons', 'light-bi-graphql.svg'))
    };

    // Graphql Request
    const swaggerServer: SwaggerServer = new SwaggerServer();
    graphqlViewPanel.webview.onDidReceiveMessage(
        async message => {
            if (message.command !== 'graphqlRequest') {
                return;
            }
            await swaggerServer.sendRequest(message.req, true).then((response) => {
                graphqlViewPanel!.webview.postMessage({
                    command: 'graphqlResponse',
                    res: response
                });
            });
        }
    );

    const darkIcon = graphqlViewPanel.webview.asWebviewUri(
        Uri.file(path.join(extension.context.extensionPath, 'resources', 'icons', 'dark-bi-graphql.svg'))
    );
    const lightIcon = graphqlViewPanel.webview.asWebviewUri(
        Uri.file(path.join(extension.context.extensionPath, 'resources', 'icons', 'light-bi-graphql.svg'))
    );

    const icons = {
        dark: darkIcon.toString(),
        light: lightIcon.toString()
    };

    if (graphqlViewPanel) {
        const html = render({ serviceAPI, icons }, graphqlViewPanel.webview);
        if (html) {
            graphqlViewPanel.webview.html = html;
        }
    }
    //editor-lowcode-code-tryit
   // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_GRAPHQL_RUN, CMP_TRYIT_GRAPHQL_VIEW);
}
