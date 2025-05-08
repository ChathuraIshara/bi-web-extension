/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { CDListener, CDModel, CDService } from "@wso2-enterprise/ballerina-core";
import { CDAutomation } from "@wso2-enterprise/ballerina-core";
import { CDConnection } from "@wso2-enterprise/ballerina-core";
import { CDFunction, CDResourceFunction } from "@wso2-enterprise/ballerina-core";
export interface DiagramContextState {
    project: CDModel;
    onListenerSelect: (listener: CDListener) => void;
    onServiceSelect: (service: CDService) => void;
    onFunctionSelect: (func: CDFunction | CDResourceFunction) => void;
    onAutomationSelect: (automation: CDAutomation) => void;
    onConnectionSelect: (connection: CDConnection) => void;
    onDeleteComponent: (component: CDListener | CDService | CDAutomation | CDConnection) => void;
}

export const DiagramContext = React.createContext<DiagramContextState>({
    project: { connections: [], listeners: [], services: [] },
    onListenerSelect: () => {},
    onServiceSelect: () => {},
    onFunctionSelect: () => {},
    onAutomationSelect: () => {},
    onConnectionSelect: () => {},
    onDeleteComponent: () => {},
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
