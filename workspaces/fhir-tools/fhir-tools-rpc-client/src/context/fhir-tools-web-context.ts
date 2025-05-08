/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createContext, useContext } from "react";
import { RpcClient } from "../RpcClient";

export interface VisualizerContext {
    rpcClient: RpcClient
}

/**
 * Global visualizer context.
 * This will be used within all the other components
 */
const defaultState: VisualizerContext = {
    rpcClient:  null
}
export const Context = createContext<VisualizerContext>(defaultState);

export const useVisualizerContext = () => useContext(Context);
