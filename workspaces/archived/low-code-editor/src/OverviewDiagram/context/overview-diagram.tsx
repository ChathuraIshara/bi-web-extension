/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { NodePosition } from "@wso2-enterprise/ballerina-languageclient";

import { ComponentViewInfo } from "../util";

export interface OverviewDiagramProperties {
    addToHistoryStack: (info: ComponentViewInfo) => void;
    navigateBack: () => void;
    navigateToMain: () => void;
    isHistoryStackEmpty: () => boolean;
    currentComponent: ComponentViewInfo;
}

export const Context = React.createContext<OverviewDiagramProperties>({
    navigateBack: undefined,
    addToHistoryStack: undefined,
    navigateToMain: undefined,
    isHistoryStackEmpty: undefined,
    currentComponent: undefined
});

export const OverviewDiagramContextProvider: React.FC<OverviewDiagramProperties> = (props) => {
    const { children, ...restProps } = props;

    return (
        <Context.Provider value={{ ...restProps }}>
            {children}
        </Context.Provider>
    )
}

export const useOverviewDiagramContext = () => React.useContext(Context);
