/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { Range } from '@wso2-enterprise/mi-syntax-tree/lib/src';
import { ExpressionFieldValue } from "../Form/ExpressionField/ExpressionInput";
import { NodeLinkModel } from "../NodeLink/NodeLinkModel";
import { MediatorNodeModel } from "../nodes/MediatorNode/MediatorNodeModel";
import { PlusNodeModel } from "../nodes/PlusNode/PlusNodeModel";

export interface SidePanelPage {
    content: ReactNode;
    isOpen: boolean;
    title?: string;
    icon?: string | ReactNode;
}

interface SidePanelContext {
    // Mediator related
    isOpen: boolean;
    isEditing: boolean;
    nodeRange?: Range;
    trailingSpace?: string;
    operationName?: string;
    node?: MediatorNodeModel | NodeLinkModel | PlusNodeModel;
    parentNode?: string;
    previousNode?: string;
    nextNode?: string;
    formValues?: { [key: string]: any };
    inputOutput?:any;
    tag?: string;
    isFormOpen?: boolean;
    isTryoutOpen?: boolean;
    connectors?: any[];
    expressionEditor?: {
        isOpen: boolean;
        value: ExpressionFieldValue;
        setValue: (value: ExpressionFieldValue) => void;
    };
    pageStack: SidePanelPage[];
    setSidePanelState?: Dispatch<SetStateAction<any>>;
    newDataMapperName?: string;
}

const SidePanelContext = React.createContext<SidePanelContext>({
    isOpen: false,
    isEditing: false,
    expressionEditor: {
        isOpen: false,
        value: undefined,
        setValue: () => { },
    },
    pageStack: [],
})

export const DefaultSidePanelState: SidePanelContext = {
    // Mediator related
    isOpen: false,
    isEditing: false,
    formValues: {},
    node: undefined,
    nodeRange: undefined,
    trailingSpace: undefined,
    isFormOpen: false,
    pageStack: [],
};

export function clearSidePanelState(sidePanelContext: SidePanelContext) {
    const state = structuredClone(DefaultSidePanelState);
    if (sidePanelContext?.setSidePanelState) sidePanelContext.setSidePanelState({ ...state, setSidePanelState: sidePanelContext.setSidePanelState });
}

export const SidePanelProvider = SidePanelContext.Provider
export default SidePanelContext
