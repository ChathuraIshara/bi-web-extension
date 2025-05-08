/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { AssignmentStatement, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { StatementEditorContext } from "../../../store/statement-editor-context";
import { ExpressionComponent } from "../../Expression";
import { TokenComponent } from "../../Token";

interface AssignmentStatementProps {
    model: AssignmentStatement;
}

export function AssignmentStatementComponent(props: AssignmentStatementProps) {
    const { model } = props;
    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: {
            currentModel,
            changeCurrentModel
        }
    } = stmtCtx;

    if (!currentModel.model) {
        changeCurrentModel(model.expression);
    }

    let expressionComponent;

    if (model.expression && STKindChecker.isReceiveAction(model.expression)) {
        expressionComponent = (
            <>
                <TokenComponent model={model.expression.leftArrow} className="operator" />
                <ExpressionComponent model={model.expression.receiveWorkers} />
            </>
        );
    } else if (model.expression && STKindChecker.isWaitAction(model.expression)) {
        expressionComponent = (
            <>
                <TokenComponent model={model.expression.waitKeyword} className="operator" />
                <ExpressionComponent model={model.expression.waitFutureExpr} />
            </>
        );
    } else {
        expressionComponent = <ExpressionComponent model={model.expression} />
    }

    return (
        <>
            <ExpressionComponent model={model.varRef} />
            <TokenComponent model={model.equalsToken} className="operator" />
            {expressionComponent}
            <TokenComponent model={model.semicolonToken} />
        </>
    );
}
