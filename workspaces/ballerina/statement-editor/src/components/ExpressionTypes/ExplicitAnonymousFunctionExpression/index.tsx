/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { ExplicitAnonymousFunctionExpression, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { ExpressionComponent } from "../../Expression";
import { ExpressionArrayComponent } from "../../ExpressionArray";
import { TokenComponent } from "../../Token";

interface ExplicitAnonymousFunctionExpressionProps {
    model: ExplicitAnonymousFunctionExpression;
}

export function ExplicitAnonymousFunctionExprComponent(props: ExplicitAnonymousFunctionExpressionProps) {
    const { model } = props;

    return (
        <>
            <TokenComponent model={model.functionKeyword} className="keyword" />
            <ExpressionComponent model={model.functionSignature} />
            {model?.functionBody && STKindChecker.isExpressionFunctionBody(model.functionBody) && (
                <>
                    <TokenComponent model={model.functionBody.rightDoubleArrow} className={"operator"} />
                    <ExpressionComponent model={model.functionBody.expression} />
                </>
            )}
            {model?.functionBody && STKindChecker.isFunctionBodyBlock(model.functionBody) && (
                <>
                    <TokenComponent model={model.functionBody.openBraceToken} className={"operator"} />
                    <ExpressionArrayComponent expressions={model?.functionBody.statements} />
                    <TokenComponent model={model.functionBody.closeBraceToken} className={"operator"} />
                </>
            )}
        </>
    );
}
