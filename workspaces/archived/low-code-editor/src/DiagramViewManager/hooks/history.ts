/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";

import { NodePosition } from "@wso2-enterprise/syntax-tree";

export interface HistoryEntry {
    file: string;
    position?: NodePosition;
    uid?: string;
    name?: string;
}

type historyPushFnType = (info: HistoryEntry) => void;
type historyPopFnType = () => void;
type historyClearAndPopulateWithFnType = (info: HistoryEntry) => void;
type historySelectFnType = (index: number) => void;
type historyClearFnType = () => void;
type updateCurrentEntryFnType = (info: HistoryEntry) => void;

export function useComponentHistory():
        [HistoryEntry[],
        historyPushFnType,
        historyPopFnType,
        historyClearAndPopulateWithFnType,
        historySelectFnType,
        historyClearFnType,
        updateCurrentEntryFnType] {
    const [history, updateHistory] = useState<HistoryEntry[]>([]);

    const historyPush = (historyEntry: HistoryEntry) => {
        updateHistory([...history, historyEntry]);
    }

    const historyPop = () => {
        if (history.length === 0) return;
        updateHistory(history.slice(0, history.length - 1));
    }

    const historyClearAndPopulateWith = (historyEntry: HistoryEntry) => {
        updateHistory([historyEntry]);
    }

    const historySelect = (index: number) => {
        updateHistory(history.slice(0, index + 1));
    }

    const historyClear = () => {
        updateHistory([]);
    }

    const updateCurrentEntry = (historyEntry: HistoryEntry) => {
        if (history.length === 0) return;
        const newHistory = [...history];
        newHistory[newHistory.length - 1] = historyEntry;
        updateHistory(newHistory);
    }

    return [history, historyPush, historyPop, historyClearAndPopulateWith, historySelect, historyClear, updateCurrentEntry];
}
