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

import { IfElseStatement, NodePosition, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree"

import { ELSEIF_CLAUSE, ELSE_CLAUSE } from "../../../constants";
import { StatementEditorContext } from "../../../store/statement-editor-context";
import { NewExprAddButton } from "../../Button/NewExprAddButton";
import { ExpressionComponent } from "../../Expression";
import { StatementRenderer } from "../../StatementRenderer";
import { TokenComponent } from "../../Token";

interface IfStatementProps {
    model: IfElseStatement;
}

export function IfStatementC(props: IfStatementProps) {
    const { model } = props;
    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: {
            currentModel,
            changeCurrentModel,
            updateModel
        }
    } = stmtCtx;

    if (!currentModel.model && !STKindChecker.isElseBlock(model)) {
        changeCurrentModel(model.condition);
    }

    const isFinalIfElseStatement = !(model.elseBody?.elseBody as IfElseStatement)?.ifBody;
    const isElseAvailable = model.elseBody?.elseBody && STKindChecker.isBlockStatement(model.elseBody?.elseBody);

    const addNewIfStatement = (ifBodyModel: STNode) => {
        const newPosition: NodePosition = {
            ...ifBodyModel.position
        }
        updateModel(`${ELSEIF_CLAUSE}`, newPosition);
    };

    const addNewElseStatement = (ifBodyModel: STNode) => {
        const newPosition: NodePosition = {
            ...ifBodyModel.position
        }
        updateModel(`${ELSE_CLAUSE}`, newPosition);
    };

    return (
        <>
            <TokenComponent model={model.ifKeyword} className="keyword" />
            <ExpressionComponent model={model.condition} />
            <TokenComponent model={model.ifBody.openBraceToken} />
            &nbsp;&nbsp;&nbsp;{"..."}
            {isFinalIfElseStatement && !isElseAvailable && <br />}
            <TokenComponent model={model.ifBody.closeBraceToken} />
            {isFinalIfElseStatement && (
                isElseAvailable ? (
                    <>
                        <NewExprAddButton model={model.ifBody.closeBraceToken} onClick={addNewIfStatement} />
                        &nbsp;
                    </>
                ) : (
                    <>
                        &nbsp;
                        <NewExprAddButton model={model.ifBody.closeBraceToken} onClick={addNewElseStatement} />
                    </>
                )
            )}
            {!!model.elseBody && <StatementRenderer model={model.elseBody} />}
        </>
    );
}
