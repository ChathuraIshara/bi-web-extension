/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { FunctionProperties, ViewMode } from "./types";

const defaultState: FunctionProperties = {
    overlayId: '',
    overlayNode: undefined,
    functionNode: undefined,
    hasWorker: false,
    viewMode: ViewMode.STATEMENT
}

export const Context = React.createContext<FunctionProperties>(defaultState);

export const Provider: React.FC<FunctionProperties> = (props) => {
    const { children, ...restProps } = props;
    return (
        <Context.Provider value={{ ...restProps }} >
            {props.children}
        </Context.Provider>
    )
}

export const useFunctionContext = () => React.useContext(Context);
