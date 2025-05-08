/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { FunctionSignature } from "@wso2-enterprise/syntax-tree";

import { ExpressionComponent } from "../../Expression";
import { ExpressionArrayComponent } from "../../ExpressionArray";
import { TokenComponent } from "../../Token";

interface FunctionSignatureProps {
    model: FunctionSignature;
}

export function FunctionSignatureComponent(props: FunctionSignatureProps) {
    const { model } = props;

    return (
        <>
            <TokenComponent model={model.openParenToken} />
            <ExpressionArrayComponent expressions={model.parameters} />
            <TokenComponent model={model.closeParenToken} />
            {model?.returnTypeDesc && <ExpressionComponent model={model.returnTypeDesc} />}
        </>
    );
}
