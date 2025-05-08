/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */
import React from 'react';

import { HistoryEntry } from '../hooks/history';

export interface HistoryProviderState {
    history: HistoryEntry[],
    historyPush: (info: HistoryEntry) => void;
    historyPop: () => void;
    historyClearAndPopulateWith: (info: HistoryEntry) => void;
    historyUpdateCurrentEntry: (info: HistoryEntry) => void;
    historySelect: (index: number) => void;
    historyReset: () => void;
}

export const Context = React.createContext<HistoryProviderState>({
    history: [],
    historyPush(info: HistoryEntry): void {
        throw new Error("Function not implemented.");
    },
    historyPop(): void {
        throw new Error('Function not implemented.');
    },
    historyClearAndPopulateWith(info: HistoryEntry): void {
        throw new Error("Function not implemented.");
    },
    historySelect(index: number): void {
        throw new Error('Function not implemented.');
    },
    historyReset(): void {
        throw new Error('Function not implemented.');
    },
    historyUpdateCurrentEntry(info: HistoryEntry): void {
        throw new Error('Function not implemented.');
    }
});

export const Provider: React.FC<HistoryProviderState> = (props) => {
    const { children, ...restProps } = props;
    return (
        <Context.Provider value={{ ...restProps }} >
            {props.children}
        </Context.Provider>
    )
}

export const useHistoryContext = () => React.useContext(Context);

