/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { NodePosition, RemoteMethodCallAction } from "@wso2-enterprise/syntax-tree";

import { ExpressionComponent } from "../../Expression";
import { ExpressionArrayComponent } from "../../ExpressionArray";
import { TokenComponent } from "../../Token";

interface RemoteMethodCallActionProps {
    model: RemoteMethodCallAction;
}

export function RemoteMethodCallActionComponent(props: RemoteMethodCallActionProps) {
    const { model } = props;

    const methodPosition: NodePosition = model.methodName.position;
    methodPosition.endLine = model.closeParenToken.position.endLLine;
    methodPosition.endColumn = model.closeParenToken.position.endColumn;

    return (
        <>
            <ExpressionComponent model={model.expression} />
            <TokenComponent model={model.rightArrowToken} className={"operator"} />
            <ExpressionComponent model={model.methodName} stmtPosition={methodPosition}>
                <TokenComponent model={model.openParenToken} />
                <ExpressionArrayComponent expressions={model.arguments} />
                <TokenComponent model={model.closeParenToken} />
            </ExpressionComponent>
        </>
    );
}
