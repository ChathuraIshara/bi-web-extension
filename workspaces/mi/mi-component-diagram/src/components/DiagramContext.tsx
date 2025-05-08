/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { Connection, EntryPoint, Project } from "../utils/types";

export interface DiagramContextState {
    project: Project;
    onEntryPointSelect: (entryPoint: EntryPoint) => void;
    onEntryPointGoToSource: (entryPoint: EntryPoint) => void;
    onDeleteComponent: (component: EntryPoint | Connection) => void;
    onConnectionSelect: (connection: Connection) => void;
}

export const DiagramContext = React.createContext<DiagramContextState>({
    project: { name:"", entryPoints: [], connections: [] },
    onEntryPointSelect: () => {},
    onEntryPointGoToSource: () => {},
    onDeleteComponent: () => {},
    onConnectionSelect: () => {},
});

export const useDiagramContext = () => React.useContext(DiagramContext);

export function DiagramContextProvider(props: { children: React.ReactNode; value: DiagramContextState }) {
    // add node states
    // enrich context with optional states
    const ctx = {
        ...props.value,
    };

    return <DiagramContext.Provider value={ctx}>{props.children}</DiagramContext.Provider>;
}
