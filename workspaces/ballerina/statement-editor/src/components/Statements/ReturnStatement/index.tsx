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

import { ReturnStatement, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { StatementEditorContext } from "../../../store/statement-editor-context";
import { ExpressionComponent } from "../../Expression";
import { TokenComponent } from "../../Token";

interface ReturnStatementProps {
    model: ReturnStatement;
}

export function ReturnStatementC(props: ReturnStatementProps) {
    const { model } = props;
    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: {
            currentModel,
            changeCurrentModel
        }
    } = stmtCtx;

    if (!currentModel.model) {
        if (model.expression){
            changeCurrentModel(model.expression);
        }
    }

    return (
        <>
            <TokenComponent model={model.returnKeyword}  className="keyword" />
            {model.expression && <ExpressionComponent model={model.expression} />}
            <TokenComponent model={model.semicolonToken} />
        </>
    );
}
