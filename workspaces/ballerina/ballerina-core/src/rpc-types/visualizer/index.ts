/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { HistoryEntry } from "../../history";
import { OpenViewRequest, UpdateUndoRedoMangerRequest } from "./interfaces";

export interface VisualizerAPI {
    openView: (params: OpenViewRequest) => void;
    getHistory: () => Promise<HistoryEntry[]>;
    addToHistory: (entry: HistoryEntry) => void;
    goBack: () => void;
    goHome: () => void;
    goSelected: (index: number) => void;
    undo: () => Promise<string>;
    redo: () => Promise<string>;
    addToUndoStack: (source: string) => void;
    updateUndoRedoManager: (params: UpdateUndoRedoMangerRequest) => void;
}
