/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactNode, useState } from "react";
import { Context, VisualizerContext} from "@wso2-enterprise/api-designer-rpc-client";
import { RpcClient } from "@wso2-enterprise/api-designer-rpc-client/lib/RpcClient";
import { MACHINE_VIEW, VisualizerLocation } from "@wso2-enterprise/api-designer-core";


export function VisualizerContextProvider({ children }: { children: ReactNode }) {

  const setView = (view: VisualizerLocation) => {
    setVisualizerState((prevState: VisualizerContext) => ({
      ...prevState,
      viewLocation: view,
    }));
  };
  
  const [visualizerState, setVisualizerState] = useState<VisualizerContext>({
    viewLocation: { view: MACHINE_VIEW.Overview },
    setViewLocation: setView,
    rpcClient: new RpcClient(), // Create the root RPC layer client object
  });

  return (
    <Context.Provider value={visualizerState}>
      {children}
    </Context.Provider>
  );
}
