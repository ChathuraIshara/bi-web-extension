/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import {
    HistoryEntry,
    OpenViewRequest,
    UpdateUndoRedoMangerRequest,
    VisualizerAPI,
    addToHistory,
    addToUndoStack,
    getHistory,
    goBack,
    goHome,
    goSelected,
    openView,
    redo,
    undo,
    updateUndoRedoManager
} from "@wso2-enterprise/ballerina-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class VisualizerRpcClient implements VisualizerAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    openView(params: OpenViewRequest): void {
        return this._messenger.sendNotification(openView, HOST_EXTENSION, params);
    }

    async getHistory(): Promise<HistoryEntry[]> {
        return this._messenger.sendRequest(getHistory, HOST_EXTENSION);
    }

    addToHistory(entry: HistoryEntry): void {
        return this._messenger.sendNotification(addToHistory, HOST_EXTENSION, entry);
    }

    goBack(): void {
        return this._messenger.sendNotification(goBack, HOST_EXTENSION);
    }

    goHome(): void {
        return this._messenger.sendNotification(goHome, HOST_EXTENSION);
    }

    goSelected(index: number): void {
        return this._messenger.sendNotification(goSelected, HOST_EXTENSION, index);
    }

    undo(): Promise<string> {
        return this._messenger.sendRequest(undo, HOST_EXTENSION);
    }

    redo(): Promise<string> {
        return this._messenger.sendRequest(redo, HOST_EXTENSION);
    }

    addToUndoStack(source: string): void {
        return this._messenger.sendNotification(addToUndoStack, HOST_EXTENSION, source);
    }

    updateUndoRedoManager(params: UpdateUndoRedoMangerRequest): void {
        return this._messenger.sendNotification(updateUndoRedoManager, HOST_EXTENSION, params);
    }
}
