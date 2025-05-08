/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { createContext, ReactNode } from 'react';
import { Type } from '@wso2-enterprise/ballerina-core';

interface DiagramContextProps {
    children?: ReactNode;
    hasDiagnostics: boolean;
    focusedNodeId?: string;
    setFocusedNodeId?: (id: string) => void;
    selectedNodeId?: string;
    setSelectedNodeId?: (id: string) => void;
    onEditNode?: (id: string, isGraphqlRoot?: boolean) => void;
    goToSource?: (node: Type) => void
}

interface IDiagramContext {
    hasDiagnostics: boolean;
    focusedNodeId?: string;
    setFocusedNodeId?: (id: string) => void;
    selectedNodeId?: string;
    setSelectedNodeId?: (id: string) => void;
    onEditNode?: (id: string, isGraphqlRoot?: boolean) => void;
    goToSource?: (node: Type) => void
}

const defaultState: any = {};
export const DiagramContext = createContext<IDiagramContext>(defaultState);

export function DesignDiagramContext(props: DiagramContextProps) {
    const {
        children,
        hasDiagnostics,
        focusedNodeId,
        setFocusedNodeId,
        selectedNodeId,
        setSelectedNodeId,
        onEditNode,
        goToSource
    } = props;

    let context: IDiagramContext = {
        hasDiagnostics,
        focusedNodeId,
        setFocusedNodeId,
        selectedNodeId,
        setSelectedNodeId,
        onEditNode,
        goToSource
    }

    return (
        <DiagramContext.Provider value={{ ...context }}>
            {children}
        </DiagramContext.Provider>
    );
}

export const useDiagramContext = () => React.useContext(DiagramContext);
