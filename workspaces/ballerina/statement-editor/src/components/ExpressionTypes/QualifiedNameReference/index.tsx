/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { QualifiedNameReference } from "@wso2-enterprise/syntax-tree";

import { ExpressionComponent } from "../../Expression";
import { TokenComponent } from "../../Token";

interface QualifiedNameReferenceProps {
    model: QualifiedNameReference;
}

export function QualifiedNameReferenceComponent(props: QualifiedNameReferenceProps) {
    const { model } = props;

    return (
        <>
            <ExpressionComponent model={model.modulePrefix} />
            <TokenComponent model={model.colon} />
            <ExpressionComponent model={model.identifier} />
        </>
    );
}
