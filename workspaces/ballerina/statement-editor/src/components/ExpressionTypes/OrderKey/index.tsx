/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { OrderKey } from "@wso2-enterprise/syntax-tree";

import { ExpressionComponent } from "../../Expression";
import { KeywordComponent } from "../../Keyword";

interface OrderKeyProps {
    model: OrderKey;
}

export function OrderKeyComponent(props: OrderKeyProps) {
    const { model } = props;

    return (
        <>
            <ExpressionComponent model={model.expression}/>
            {model.orderDirection &&
            <KeywordComponent model={model.orderDirection}/>
            }
        </>
    );
}
