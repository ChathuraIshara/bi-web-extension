/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactNode, useState } from "react";
import {VisualizerContext, Context, FHIRToolsRpcClient} from "@wso2-enterprise/fhir-tools-rpc-client";


export function VisualizerContextProvider({ children }: { children: ReactNode }) {

  const [visualizerState, setVisualizerState] = useState<VisualizerContext>({
    rpcClient: new FHIRToolsRpcClient() // Create the root RPC layer client object
  });

  return (
    <Context.Provider value={visualizerState}>
      {children}
    </Context.Provider>
  );
}
