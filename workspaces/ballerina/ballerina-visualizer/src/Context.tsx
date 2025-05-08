/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactNode, useRef, useState, createContext, useContext } from "react";
import { BallerinaRpcClient, VisualizerContext as RpcContext, Context } from "@wso2-enterprise/ballerina-rpc-client";
import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";
import { ConnectorInfo, TriggerModelsResponse } from "@wso2-enterprise/ballerina-core";

export function RpcContextProvider({ children }: { children: ReactNode }) {
    const rpcClient = useRef(new BallerinaRpcClient());

    const contextValue: RpcContext = {
        rpcClient: rpcClient.current,
    };

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}



export enum PanelType {
    STATEMENTEDITOR = "STATEMENTEDITOR",
    CONSTRUCTPANEL = "CONSTRUCTPANEL",
};

interface PanelDetails {
    isActive: boolean;
    name?: PanelType;
    contentUpdated?: boolean;
}

interface ComponentInfo {
    model: STNode;
    position: NodePosition;
    componentType: string;
    connectorInfo?: ConnectorInfo;
}

interface ActiveFileInfo {
    fullST: STNode;
    filePath: string;
    activeSequence: STNode;
}

export type SidePanel = "EMPTY" | "RECORD_EDITOR" | "ADD_CONNECTION" | "ADD_ACTION";

interface VisualizerContext {
    popupMessage: boolean;
    setPopupMessage: (value: boolean) => void;
    sidePanel: SidePanel;
    screenMetadata: any;
    setSidePanel: (panel: SidePanel) => void;
    setScreenMetadata: (metadata: any) => void;
    activePanel: PanelDetails;
    setActivePanel: (panelDetails: PanelDetails) => void;
    statementPosition: NodePosition;
    setStatementPosition: (position: NodePosition) => void;
    activeFileInfo?: ActiveFileInfo;
    setActiveFileInfo?: (activeFileInfo: ActiveFileInfo) => void;
    componentInfo?: ComponentInfo;
    setComponentInfo?: (componentInfo: ComponentInfo) => void;
    cacheTriggers: TriggerModelsResponse,
    setCacheTriggers: (componentInfo: TriggerModelsResponse) => void;
}

export const VisualizerContext = createContext({
    activePanel: { isActive: false },
    setActivePanel: (panelDetails: PanelDetails) => { },
    statementPosition: undefined,
    setStatementPosition: (position: NodePosition) => { },
    activeFileInfo: undefined,
    setActiveFileInfo: (activeFileInfo: ActiveFileInfo) => { },
    componentInfo: undefined,
    setComponentInfo: (componentInfo: ComponentInfo) => { },
    cacheTriggers: undefined,
    setCacheTriggers: (triggers: TriggerModelsResponse) => { },

} as VisualizerContext);

export function VisualizerContextProvider({ children }: { children: ReactNode }) {
    const [popupMessage, setPopupMessage] = useState(false);
    const [sidePanel, setSidePanel] = useState("EMPTY" as SidePanel);
    const [metadata, setMetadata] = useState({} as any);
    const [activePanel, setActivePanel] = useState({ isActive: false });
    const [statementPosition, setStatementPosition] = useState<NodePosition>();
    const [componentInfo, setComponentInfo] = useState<ComponentInfo>();
    const [activeFileInfo, setActiveFileInfo] = useState<ActiveFileInfo>();
    const [cacheTriggers, setCacheTriggers] = useState<TriggerModelsResponse>({ local: [] });


    const contextValue: VisualizerContext = {
        popupMessage: popupMessage,
        screenMetadata: metadata,
        setPopupMessage: setPopupMessage,
        sidePanel: sidePanel,
        setSidePanel: setSidePanel,
        setScreenMetadata: setMetadata,
        activePanel: activePanel,
        setActivePanel: setActivePanel,
        statementPosition: statementPosition,
        setStatementPosition: setStatementPosition,
        activeFileInfo: activeFileInfo,
        setActiveFileInfo: setActiveFileInfo,
        componentInfo: componentInfo,
        setComponentInfo: setComponentInfo,
        cacheTriggers: cacheTriggers,
        setCacheTriggers: setCacheTriggers
    };

    return <VisualizerContext.Provider value={contextValue}>{children}</VisualizerContext.Provider>;
}

export const useVisualizerContext = () => useContext(VisualizerContext);
