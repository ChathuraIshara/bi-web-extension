import React from "react";

import { ExpressionInjectablesProps } from "./config-spec";

export interface ExpressionConfigurableProps {
    varType: string;
    textLabel: string;
    expressionInjectables?: ExpressionInjectablesProps;
    model: any;
    monacoRef: React.MutableRefObject<any>;
    showConfigurableView: boolean;
    setShowConfigurableView: (visible: boolean) => void;
}

export const configurableTypes = ["string", "int", "float", "boolean", "xml"];
