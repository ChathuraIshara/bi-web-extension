/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { WebviewView, WebviewPanel, window, env } from 'vscode';
import { Messenger } from 'vscode-messenger';
import { StateMachine } from './stateMachine';
import { stateChanged, getVisualizerState, getAIVisualizerState, VisualizerLocation, AIVisualizerLocation, sendAIStateEvent, AI_EVENT_TYPE, aiStateChanged, themeChanged, getPopupVisualizerState, PopupVisualizerLocation, popupStateChanged, webviewReady, Platform } from '@wso2-enterprise/mi-core';
import { registerMiDiagramRpcHandlers } from './rpc-managers/mi-diagram/rpc-handler';
import { VisualizerWebview } from './visualizer/webview';
import { registerMiVisualizerRpcHandlers } from './rpc-managers/mi-visualizer/rpc-handler';
import { AiPanelWebview } from './ai-panel/webview';
import { StateMachineAI } from './ai-panel/aiMachine';
import { registerMiDataMapperRpcHandlers } from './rpc-managers/mi-data-mapper/rpc-handler';
import { extension } from './MIExtensionContext';
import { registerMiDebuggerRpcHandlers } from './rpc-managers/mi-debugger/rpc-handler';
import { StateMachinePopup } from './stateMachinePopup';
import path = require('path');
const os = require('os')
const platform = getPlatform();

export class RPCLayer {
    static _messenger: Messenger = new Messenger();

    constructor(webViewPanel: WebviewPanel | WebviewView) {
        if (isWebviewPanel(webViewPanel)) {
            RPCLayer._messenger.onNotification(webviewReady, () => {
                RPCLayer._messenger.sendNotification(stateChanged, { type: 'webview', webviewType: VisualizerWebview.viewType }, StateMachine.state());
            });
            RPCLayer._messenger.registerWebviewPanel(webViewPanel as WebviewPanel);
            StateMachine.service().onTransition((state) => {
                RPCLayer._messenger.sendNotification(stateChanged, { type: 'webview', webviewType: VisualizerWebview.viewType }, state.value);
            });
            // Form machine transition
            StateMachinePopup.service().onTransition((state) => {
                RPCLayer._messenger.sendNotification(popupStateChanged, { type: 'webview', webviewType: VisualizerWebview.viewType }, state.value);
            });
            window.onDidChangeActiveColorTheme((theme) => {
                RPCLayer._messenger.sendNotification(themeChanged, { type: 'webview', webviewType: VisualizerWebview.viewType }, theme.kind);
            });
        } else {
            RPCLayer._messenger.registerWebviewPanel(webViewPanel as WebviewPanel);
            StateMachineAI.service().onTransition((state) => {
                RPCLayer._messenger.sendNotification(aiStateChanged, { type: 'webview', webviewType: AiPanelWebview.viewType }, state.value);
            });
        }
    }

    static create(webViewPanel: WebviewPanel | WebviewView) {
        return new RPCLayer(webViewPanel);
    }

    static init() {
        // ----- Main Webview RPC Methods
        RPCLayer._messenger.onRequest(getVisualizerState, () => getContext());
        registerMiDiagramRpcHandlers(RPCLayer._messenger);
        registerMiVisualizerRpcHandlers(RPCLayer._messenger);
        registerMiDataMapperRpcHandlers(RPCLayer._messenger);
        registerMiDebuggerRpcHandlers(RPCLayer._messenger);
        // ----- AI Webview RPC Methods
        RPCLayer._messenger.onRequest(getAIVisualizerState, () => getAIContext());
        RPCLayer._messenger.onRequest(sendAIStateEvent, (event: AI_EVENT_TYPE) => StateMachineAI.sendEvent(event));
        // ----- Form Views RPC Methods
        RPCLayer._messenger.onRequest(getPopupVisualizerState, () => getFormContext());
    }

}

async function getContext(): Promise<VisualizerLocation> {
    const context = StateMachine.context();
    return new Promise((resolve) => {
        resolve({
            documentUri: context.documentUri,
            view: context.view,
            identifier: context.identifier,
            projectUri: context.projectUri,
            platform,
            pathSeparator: path.sep,
            projectOpened: context.projectOpened,
            customProps: context.customProps,
            stNode: context.stNode,
            diagnostics: context.diagnostics,
            dataMapperProps: context.dataMapperProps,
            errors: context.errors
        });
    });
}

async function getAIContext(): Promise<AIVisualizerLocation> {
    const context = StateMachineAI.context();
    return new Promise((resolve) => {
        resolve({ view: context.view, initialPrompt: extension.initialPrompt, state: StateMachineAI.state(), userTokens: context.userTokens });
    });
}

async function getFormContext(): Promise<PopupVisualizerLocation> {
    const context = StateMachinePopup.context();
    return new Promise((resolve) => {
        resolve({
            projectUri: StateMachine.context().projectUri,
            documentUri: context.documentUri,
            view: context.view,
            recentIdentifier: context.recentIdentifier,
            customProps: context.customProps,
            platform,
            pathSeparator: path.sep
        });
    });
}

function isWebviewPanel(webview: WebviewPanel | WebviewView): boolean {
    return webview.viewType === VisualizerWebview.viewType;
}

function getPlatform() {
    if (os.platform() === 'linux' || env.remoteName === 'wsl') {
        return Platform.LINUX;
    }
    if (os.platform()?.startsWith('win')) {
        return Platform.WINDOWS;
    }
    if (os.platform() === 'darwin') {
        return Platform.MAC;
    }
}
