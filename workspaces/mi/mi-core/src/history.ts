/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { VisualizerLocation } from "./state-machine-types";

export interface HistoryEntry {
    location: VisualizerLocation;
    uid?: string;
    depth?: number;
}

export class History {
    private historyStack: HistoryEntry[] = [];

    public get(): HistoryEntry[] {
        return [...this.historyStack];
    }

    public push(item: HistoryEntry): void {
        this.historyStack.push(item);
    }
    
    public pop(): HistoryEntry | undefined {
        return this.historyStack.pop();
    }
    
    public select(index: number): void {
        if (index < 0 || index >= this.historyStack.length) return;
        this.historyStack = this.historyStack.slice(0, index + 1);
    }
    
    public clear(): void {
        this.historyStack = [];
    }
    
    public clearAndPopulateWith(historyEntry: HistoryEntry): void {
        this.historyStack = [historyEntry];
    }
    
    public updateCurrentEntry(historyEntry: HistoryEntry): void {
        if (this.historyStack.length === 0) return;
        const newHistory = [...this.historyStack];
        newHistory[newHistory.length - 1] = historyEntry;
        this.historyStack = newHistory;
    }
}
