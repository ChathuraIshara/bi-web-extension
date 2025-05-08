/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { ActionStatement, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { ACTION, HTTP_ACTION } from "../../../constants";
import { StatementEditorContext } from "../../../store/statement-editor-context";
import { ExpressionComponent } from "../../Expression";
import { TokenComponent } from "../../Token";

interface ReturnStatementProps {
    model: ActionStatement;
}

export function ActionStatementC(props: ReturnStatementProps) {
    const { model } = props;
    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: { currentModel, changeCurrentModel },
        config,
    } = stmtCtx;

    if (!currentModel.model) {
        if (
            (config.type === ACTION || config.type === HTTP_ACTION) &&
            model &&
            STKindChecker.isCheckAction(model.expression) &&
            STKindChecker.isRemoteMethodCallAction(model.expression.expression)
        ) {
            if (model.expression.expression.arguments?.length > 0) {
                changeCurrentModel(model.expression.expression.arguments[0]);
            } else {
                changeCurrentModel(model.expression.expression);
            }
        } else if (model && STKindChecker.isAsyncSendAction(model.expression)) {
            changeCurrentModel(model.expression.peerWorker);
        } else {
            changeCurrentModel(model.expression);
        }
    }

    let component: JSX.Element;
    if (STKindChecker.isAsyncSendAction(model.expression)) {
        const expressionModel: any = model.expression as any;
        component = (
            <>
                <ExpressionComponent model={expressionModel.expression} />
                <TokenComponent model={expressionModel.rightArrowToken} />
                <ExpressionComponent model={expressionModel.peerWorker} />
                <TokenComponent model={model.semicolonToken} />
            </>
        );
    } else {
        component = (
            <>
                <ExpressionComponent model={model.expression} />
                <TokenComponent model={model.semicolonToken} />
            </>
        );
    }

    return component;
}
