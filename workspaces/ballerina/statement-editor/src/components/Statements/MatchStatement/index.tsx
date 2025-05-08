/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext } from "react";

import { MatchStatement } from "@wso2-enterprise/syntax-tree";

import { StatementEditorContext } from "../../../store/statement-editor-context";
import { ExpressionComponent } from "../../Expression";
import { ExpressionArrayComponent } from "../../ExpressionArray";
import { TokenComponent } from "../../Token";

interface MatchStatementProps {
    model: MatchStatement;
}

export function MatchStatementC(props: MatchStatementProps) {
    const { model } = props;
    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: {
            currentModel,
            changeCurrentModel
        }
    } = stmtCtx;

    if (!currentModel.model) {
        changeCurrentModel(model.condition);
    }

    return (
        <>
            <TokenComponent model={model.matchKeyword} className="keyword"/>
            <ExpressionComponent model={model.condition}/>
            <TokenComponent model={model.openBrace}/>
            <ExpressionArrayComponent expressions={model.matchClauses} />
            <TokenComponent model={model.closeBrace}/>
        </>
    );
}
