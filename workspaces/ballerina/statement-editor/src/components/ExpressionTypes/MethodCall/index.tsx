/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext } from "react";

import { MethodCall, NodePosition, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { StatementEditorContext } from "../../../store/statement-editor-context";
import { PARAMETER_PLACEHOLDER } from "../../../utils/expressions";
import { ExpressionComponent } from "../../Expression";
import { ExpressionArrayComponent } from "../../ExpressionArray";
import { TokenComponent } from "../../Token";

interface MethodCallProps {
    model: MethodCall;
}

export function MethodCallComponent(props: MethodCallProps) {
    const { model } = props;
    const {
        modelCtx: {
            currentModel,
            changeCurrentModel
        }
    } = useContext(StatementEditorContext);

    const methodPosition: NodePosition = model.methodName.position
    methodPosition.endLine = model.closeParenToken.position.endLLine;
    methodPosition.endColumn = model.closeParenToken.position.endColumn;

    if (!currentModel.model || (currentModel.model.source === PARAMETER_PLACEHOLDER)) {
        if (model && STKindChecker.isMethodCall(model)) {
            changeCurrentModel(model);
        }
    }

    return (
        <>
            <ExpressionComponent model={model.expression} />
            <TokenComponent model={model.dotToken} />
            <ExpressionComponent model={model.methodName} stmtPosition={methodPosition} >
                <TokenComponent model={model.openParenToken} />
                <ExpressionArrayComponent expressions={model.arguments} />
                <TokenComponent model={model.closeParenToken} />
            </ExpressionComponent>
        </>
    );
}
