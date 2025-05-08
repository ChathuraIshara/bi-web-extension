/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Messenger } from "vscode-messenger-webview";
import { MachineStateValue, stateChanged, vscode, getVisualizerState, VisualizerLocation, webviewReady, onFileContentUpdate, PopupMachineStateValue, popupStateChanged, PopupVisualizerLocation, getPopupVisualizerState, onParentPopupSubmitted, ParentPopupData, APIDesignerVisualizerAPI, SelectQuickPickItemReq, WebviewQuickPickItem, selectQuickPickItem, selectQuickPickItems, showConfirmMessage, ShowConfirmBoxReq, showInputBox, ShowWebviewInputBoxReq, showInfoNotification, showErrorNotification  } from "@wso2-enterprise/api-designer-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { ApiDesignerVisualizerRpcClient } from "./rpc-clients/api-designer-visualizer/rpc-client";

export class RpcClient {

    private messenger: Messenger;
    private _visualizer: APIDesignerVisualizerAPI;

    constructor() {
        this.messenger = new Messenger(vscode);
        this.messenger.start();
        this._visualizer = new ApiDesignerVisualizerRpcClient(this.messenger);
    }

    getApiDesignerVisualizerRpcClient(): APIDesignerVisualizerAPI {
        return this._visualizer;
    }

    onStateChanged(callback: (state: MachineStateValue) => void) {
        this.messenger.onNotification(stateChanged, callback);
    }

    onPopupStateChanged(callback: (state: PopupMachineStateValue) => void) {
        this.messenger.onNotification(popupStateChanged, callback);
    }

    getVisualizerState(): Promise<VisualizerLocation> {
        return this.messenger.sendRequest(getVisualizerState, HOST_EXTENSION);
    }

    getPopupVisualizerState(): Promise<PopupVisualizerLocation> {
        return this.messenger.sendRequest(getPopupVisualizerState, HOST_EXTENSION);
    }

    onFileContentUpdate(callback: () => void): void {
        this.messenger.onNotification(onFileContentUpdate, callback);
    }
    
    webviewReady(): void {
        this.messenger.sendNotification(webviewReady, HOST_EXTENSION);
    }

    onParentPopupSubmitted(callback: (parent: ParentPopupData) => void) {
        this.messenger.onNotification(onParentPopupSubmitted, callback);
    }

    selectQuickPickItem(params: SelectQuickPickItemReq): Promise<WebviewQuickPickItem | undefined> {
        return this.messenger.sendRequest(selectQuickPickItem, HOST_EXTENSION, params);
    }

    selectQuickPickItems(params: SelectQuickPickItemReq): Promise<WebviewQuickPickItem[] | undefined> {
        return this.messenger.sendRequest(selectQuickPickItems, HOST_EXTENSION, params);
    }

    showConfirmMessage(params: ShowConfirmBoxReq): Promise<boolean> {
        return this.messenger.sendRequest(showConfirmMessage, HOST_EXTENSION, params);
    }

    showInputBox(params: ShowWebviewInputBoxReq): Promise<string | undefined> {
        return this.messenger.sendRequest(showInputBox, HOST_EXTENSION, params);
    }

    showInfoNotification(message: string): void {
        this.messenger.sendNotification(showInfoNotification, HOST_EXTENSION, message);
    }

    showErrorNotification(message: string): void {
        this.messenger.sendNotification(showErrorNotification, HOST_EXTENSION, message);
    }
}

