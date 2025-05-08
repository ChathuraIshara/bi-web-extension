/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { createContext, ReactNode, useState } from "react";
import { CommonRPCAPI, Diagnostic, STModification } from "@wso2-enterprise/ballerina-core";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

export interface ServiceDesignerContext {
  diagnostics: Diagnostic[];
  setDiagnostics: (newDiagnostics: Diagnostic[]) => void;
  dPosition: NodePosition;
  setDPosition: (dPosition: NodePosition) => void;
  commonRpcClient: CommonRPCAPI,
  applyModifications: (modifications: STModification[]) => Promise<void>
  serviceEndPosition: NodePosition;
}

export const Context = createContext<ServiceDesignerContext>(undefined);

interface ContextProviderProps {
  children: ReactNode,
  commonRpcClient: CommonRPCAPI,
  applyModifications: (modifications: STModification[]) => Promise<void>,
  serviceEndPosition: NodePosition;
}

export function ContextProvider({ children, commonRpcClient, applyModifications, serviceEndPosition }: ContextProviderProps) {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [dPosition, setDPosition] = useState<NodePosition>(undefined);
  return (
    <Context.Provider value={
      {
        diagnostics,
        setDiagnostics,
        dPosition,
        setDPosition,
        commonRpcClient,
        applyModifications,
        serviceEndPosition
      }}>
      {children}
    </Context.Provider>
  );
}
