/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext } from "react";

import { ForeachStatement } from "@wso2-enterprise/syntax-tree";

import { StatementEditorContext } from "../../../store/statement-editor-context";
import { ExpressionComponent } from "../../Expression";
import { TokenComponent } from "../../Token";

interface ForeachStatementProps {
    model: ForeachStatement;
}

export function ForeachStatementC(props: ForeachStatementProps) {
    const { model } = props;

    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: {
            currentModel,
            changeCurrentModel
        }
    } = stmtCtx;

    if (!currentModel.model) {
        changeCurrentModel(model.actionOrExpressionNode);
    }

    return (
        <>
            <TokenComponent model={model.forEachKeyword} className="keyword"/>
            <ExpressionComponent model={model.typedBindingPattern}/>
            <TokenComponent model={model.inKeyword} className="keyword"/>
            <ExpressionComponent model={model.actionOrExpressionNode}/>
            <TokenComponent model={model.blockStatement.openBraceToken}/>
            &nbsp;&nbsp;&nbsp;{"..."}
            <TokenComponent model={model.blockStatement.closeBraceToken}/>
        </>
    );
}
