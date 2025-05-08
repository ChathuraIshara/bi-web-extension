/* eslint-disable @typescript-eslint/no-explicit-any */
 
/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Messenger } from "vscode-messenger-webview";
import { MachineStateValue, stateChanged, vscode, getVisualizerState, getAIVisualizerState, VisualizerLocation, AIVisualizerLocation, webviewReady, onFileContentUpdate, AI_EVENT_TYPE, sendAIStateEvent, AIMachineStateValue, aiStateChanged, themeChanged, ColorThemeKind, PopupMachineStateValue, popupStateChanged, PopupVisualizerLocation, getPopupVisualizerState, onParentPopupSubmitted, ParentPopupData, ConnectorStatus, onConnectorStatusUpdate, onDocumentSave, Document, SwaggerData, DownloadProgressData, onSwaggerSpecReceived, MiServerRunStatus, miServerRunStateChanged, onDownloadProgress  } from "@wso2-enterprise/mi-core";
import { MiDiagramRpcClient } from "./rpc-clients/mi-diagram/rpc-client";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { MiVisualizerRpcClient } from "./rpc-clients/mi-visualizer/rpc-client";
import { MiDataMapperRpcClient } from "./rpc-clients/mi-data-mapper/rpc-client";
import { MiDebuggerRpcClient } from "./rpc-clients/mi-debugger/rpc-client";

export class RpcClient {

    private messenger: Messenger;
    private _diagram: MiDiagramRpcClient;
    private _visualizer: MiVisualizerRpcClient;
    private _dataMapper: MiDataMapperRpcClient;
    private _debugger: MiDebuggerRpcClient;

    constructor() {
        this.messenger = new Messenger(vscode);
        this.messenger.start();
        this._diagram = new MiDiagramRpcClient(this.messenger);
        this._visualizer = new MiVisualizerRpcClient(this.messenger);
        this._dataMapper = new MiDataMapperRpcClient(this.messenger);
        this._debugger = new MiDebuggerRpcClient(this.messenger);
    }

    getMiDiagramRpcClient(): MiDiagramRpcClient {
        return this._diagram;
    }

    getMiVisualizerRpcClient(): MiVisualizerRpcClient {
        return this._visualizer;
    }

    getMiDataMapperRpcClient(): MiDataMapperRpcClient {
        return this._dataMapper;
    }

    getMiDebuggerRpcClient(): MiDebuggerRpcClient {
        return this._debugger;
    }

    onStateChanged(callback: (state: MachineStateValue) => void) {
        this.messenger.onNotification(stateChanged, callback);
    }

    onAIStateChanged(callback: (state: AIMachineStateValue) => void) {
        this.messenger.onNotification(aiStateChanged, callback);
    }

    onMiServerRunStateChanged(callback: (state: MiServerRunStatus) => void) {
        this.messenger.onNotification(miServerRunStateChanged, callback);
    }

    onPopupStateChanged(callback: (state: PopupMachineStateValue) => void) {
        this.messenger.onNotification(popupStateChanged, callback);
    }

    onThemeChanged(callback: (kind: ColorThemeKind) => void) {
        this.messenger.onNotification(themeChanged, callback);

    }

    getVisualizerState(): Promise<VisualizerLocation> {
        return this.messenger.sendRequest(getVisualizerState, HOST_EXTENSION);
    }

    getAIVisualizerState(): Promise<AIVisualizerLocation> {
        return this.messenger.sendRequest(getAIVisualizerState, HOST_EXTENSION);
    }

    getPopupVisualizerState(): Promise<PopupVisualizerLocation> {
        return this.messenger.sendRequest(getPopupVisualizerState, HOST_EXTENSION);
    }

    sendAIStateEvent(event: AI_EVENT_TYPE) {
        this.messenger.sendRequest(sendAIStateEvent, HOST_EXTENSION, event);
    }

    onFileContentUpdate(callback: () => void): void {
        this.messenger.onNotification(onFileContentUpdate, callback);
    }

    onSwaggerSpecReceived(callback: (data: SwaggerData) => void) {
        this.messenger.onNotification(onSwaggerSpecReceived, callback);
    }

    onDownloadProgress(callback: (data: DownloadProgressData) => void) {
        this.messenger.onNotification(onDownloadProgress, callback);
    }
    
    webviewReady(): void {
        this.messenger.sendNotification(webviewReady, HOST_EXTENSION);
    }

    onParentPopupSubmitted(callback: (parent: ParentPopupData) => void) {
        this.messenger.onNotification(onParentPopupSubmitted, callback);
    }

    onConnectorStatusUpdate(callback: (status: ConnectorStatus) => void) {
        this.messenger.onNotification(onConnectorStatusUpdate, callback);
    }

    onDocumentSave(callback: (document: Document) => void) {
        this.messenger.onNotification(onDocumentSave, callback);
    }
}

