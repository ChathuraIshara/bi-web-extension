/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    UpdateUndoRedoMangerRequest,
    VisualizerAPI,
    OpenViewRequest,
    MACHINE_VIEW,
    PopupVisualizerLocation,
    VisualizerLocation,
    EVENT_TYPE,
    SHARED_COMMANDS
} from "@wso2-enterprise/ballerina-core";
import { history, openView, undoRedoManager, updateView } from "../../stateMachine";
import { openPopupView } from "../../stateMachinePopup";
import { commands } from "vscode";

export class VisualizerRpcManager implements VisualizerAPI {

    openView(params: OpenViewRequest): Promise<void> {
        return new Promise(async (resolve) => {
            if (params.isPopup) {
                const view = params.location.view;
                if (view && view === MACHINE_VIEW.Overview) {
                    openPopupView(EVENT_TYPE.CLOSE_VIEW, params.location as PopupVisualizerLocation);
                } else {
                    openPopupView(params.type, params.location as PopupVisualizerLocation);
                }
            } else {
                openView(params.type, params.location as VisualizerLocation);
            }
        });
    }

    goBack(): void {
        history.pop();
        updateView();
    }

    async getHistory(): Promise<HistoryEntry[]> {
        return history.get();
    }

    goHome(): void {
        history.clear();
        commands.executeCommand(SHARED_COMMANDS.FORCE_UPDATE_PROJECT_ARTIFACTS);
    }

    goSelected(index: number): void {
        history.select(index);
        updateView();
    }

    addToHistory(entry: HistoryEntry): void {
        history.push(entry);
        updateView();
    }

    async undo(): Promise<string> {
        return undoRedoManager.undo();
    }

    async redo(): Promise<string> {
        return undoRedoManager.redo();
    }

    addToUndoStack(source: string): void {
        undoRedoManager.addModification(source);
    }

    updateUndoRedoManager(params: UpdateUndoRedoMangerRequest): void {
        undoRedoManager.updateContent(params.filePath, params.fileContent);
    }
}
