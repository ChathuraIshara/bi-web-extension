/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { ReturnTypeDescriptor } from "@wso2-enterprise/syntax-tree";

import { ExpressionComponent } from "../../../Expression";
import { ExpressionArrayComponent } from "../../../ExpressionArray";
import { TokenComponent } from "../../../Token";

interface ReturnTypeDescProps {
    model: ReturnTypeDescriptor;
}

export function ReturnTypeDescComponent(props: ReturnTypeDescProps) {
    const { model } = props;

    return (
        <>
            {!!model.annotations.length && <ExpressionArrayComponent expressions={model.annotations} />}
            <TokenComponent model={model.returnsKeyword} className="keyword" />
            <ExpressionComponent model={model.type} />
        </>
    );
}
