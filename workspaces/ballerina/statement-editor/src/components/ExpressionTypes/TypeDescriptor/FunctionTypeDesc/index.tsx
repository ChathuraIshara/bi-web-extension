/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { FunctionTypeDesc } from "@wso2-enterprise/syntax-tree";

import { ExpressionComponent } from "../../../Expression";
import { ExpressionArrayComponent } from "../../../ExpressionArray";
import { TokenComponent } from "../../../Token";

interface FunctionTypeDescProps {
    model: FunctionTypeDesc;
}

export function FunctionTypeDescComponent(props: FunctionTypeDescProps) {
    const { model } = props;

    return (
        <>
            {!!model.qualifierList.length && <ExpressionArrayComponent expressions={model.qualifierList} />}
            <TokenComponent model={model.functionKeyword} className="keyword" />
            <ExpressionComponent model={model.functionSignature} />
        </>
    );
}
