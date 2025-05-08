/**
 * Copyright (c) 2018, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { commands, window, Uri, ViewColumn, ExtensionContext, WebviewPanel, workspace } from 'vscode';
import { join } from 'path';
import { render } from './renderer';
import { ExtendedLangClient } from '../../core/extended-language-client';
import { ballerinaExtInstance, BallerinaExtension } from '../../core';
import { getCommonWebViewOptions } from '../../utils';
// import { TM_EVENT_OPEN_EXAMPLES, CMP_EXAMPLES_VIEW, sendTelemetryEvent, sendTelemetryException } from '../../features/telemetry';
import { PALETTE_COMMANDS } from '../../features/project';

let examplesPanel: WebviewPanel | undefined;
const exampleMaps = new Map([
    ['distributed-transactions', 'initiator.bal'],
    ['basic-https-listener-client', 'basic_https_listener.bal'],
    ['mutual-ssl', 'mutual_ssl_service.bal'],
    ['http-cookies', 'cookie_server.bal'],
    ['http-2-0-server-push', 'http_2_0_service.bal'],
    ['grpc-simple', 'grpc_simple_service.bal'],
    ['grpc-simple-with-headers', 'grpc_simple_with_headers_service.bal'],
    ['grpc-secured-simple', 'grpc_secured_simple_service.bal'],
    ['grpc-unary-blocking', 'grpc_unary_blocking_service.bal'],
    ['grpc-server-streaming', 'grpc_server_streaming_service.bal'],
    ['grpc-client-streaming', 'grpc_client_streaming_service.bal'],
    ['grpc-bidirectional-streaming', 'grpc_bidirectional_streaming_service.bal'],
    ['grpc-secured-unary', 'grpc_secured_unary_service.bal'],
    ['proto-to-ballerina', 'proto_to_ballerina.proto'],
    ['openapi-to-ballerina', 'openapi_to_ballerina.yaml'],
    ['testerina-mocking-functions', 'testerina_mocking_functions_test.bal'],
    ['testerina-mocking-objects', 'testerina_mocking_objects_test.bal'],
    ['nats-basic-pub-sub', 'publisher.bal'],
    ['nats-basic-request-reply', 'publisher.bal'],
    ['nats-basic-client', 'publisher.bal'],
    ['nats-streaming-client', 'publisher.bal'],
    ['nats-streaming-pub-sub', 'publisher.bal'],
    ['nats-streaming-durable-subscriptions', 'publisher.bal'],
    ['nats-streaming-queue-group', 'publisher.bal'],
    ['nats-streaming-start-position', 'publisher.bal'],
    ['tcp-transport-security', 'tcp_transport_security_client.bal'],
    ['nats-basic-secure-connection', 'publisher.bal'],
    ['websocket-client-oauth2-client-cred-grant-type', 'websocket_client_oauth2_client_credentials_grant_type.bal'],
    ['rabbitmq-secure-connection', 'producer.bal']
]);

function showExamples(context: ExtensionContext, langClient: ExtendedLangClient): void {
    if (examplesPanel) {
        examplesPanel.reveal();
        return;
    }
    // Create and show a new webview
    examplesPanel = window.createWebviewPanel(
        'ballerinaExamples',
        "Ballerina Examples",
        { viewColumn: ViewColumn.One, preserveFocus: false },
        getCommonWebViewOptions()
    );
    // const remoteMethods: WebViewMethod[] = [
    //     {
    //         methodName: "openExample",
    //         handler: (args: any[]): Thenable<any> => {
    //             const url = args[0];
    //             const ballerinaHome = ballerinaExtInstance.getBallerinaHome();
    //             if (ballerinaHome) {
    //                 const folderPath = join(ballerinaHome, 'examples', url);
    //                 const filePath = join(folderPath, exampleMaps.has(url) ? exampleMaps.get(url)!
    //                     : `${url.replace(/-/g, '_')}.bal`);
    //                 workspace.openTextDocument(Uri.file(filePath)).then(doc => {
    //                     window.showTextDocument(doc);
    //                 }, (err: Error) => {
    //                     window.showErrorMessage(err.message);
    //                     sendTelemetryException(ballerinaExtInstance, err, CMP_EXAMPLES_VIEW);
    //                 });
    //             }
    //             return Promise.resolve();
    //         }
    //     }
    // ];
    // WebViewRPCHandler.create(examplesPanel, langClient, remoteMethods);
    if (examplesPanel) {
        const html = render(context, langClient, examplesPanel.webview);
        if (html) {
            examplesPanel.webview.html = html;
        }
    }
    examplesPanel.onDidDispose(() => {
        examplesPanel = undefined;
    });
}

export function activate(ballerinaExtInstance: BallerinaExtension) {
    const context = <ExtensionContext>ballerinaExtInstance.context;
    const langClient = <ExtendedLangClient>ballerinaExtInstance.langClient;
    const examplesListRenderer = commands.registerCommand(PALETTE_COMMANDS.SHOW_EXAMPLES, () => {
       // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_OPEN_EXAMPLES, CMP_EXAMPLES_VIEW);
        showExamples(context, langClient);
    });

    context.subscriptions.push(examplesListRenderer);
}
