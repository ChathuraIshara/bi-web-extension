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

import { FunctionCall, STKindChecker } from "@wso2-enterprise/syntax-tree";
import cn from "classnames";

import { CALL_CONFIG_TYPE, EXPR_CONSTRUCTOR, FUNCTION_CALL } from "../../../constants";
import { StatementEditorContext } from "../../../store/statement-editor-context";
import { isPositionsEquals } from "../../../utils";
import { FUNCTION_CALL_PLACEHOLDER, PARAMETER_PLACEHOLDER } from "../../../utils/expressions";
import { NewExprAddButton } from "../../Button/NewExprAddButton";
import { ExpressionArrayComponent } from "../../ExpressionArray";
import { InputEditor, InputEditorProps } from "../../InputEditor";
import { useStatementRendererStyles } from "../../styles";
import { TokenComponent } from "../../Token";

interface FunctionCallProps {
    model: FunctionCall;
}

export function FunctionCallComponent(props: FunctionCallProps) {
    const { model } = props;
    const {
        modelCtx: {
            updateModel,
            hasRestArg,
            currentModel,
            changeCurrentModel,
            hasSyntaxDiagnostics
        },
        config
    } = useContext(StatementEditorContext);

    const isOnPlaceholder = (model.source === FUNCTION_CALL) && config.type === CALL_CONFIG_TYPE;
    const statementRendererClasses = useStatementRendererStyles();

    const isSelected = currentModel.model && model && isPositionsEquals(currentModel.model.position, model.position);

    const styleClassNames = cn(statementRendererClasses.expressionElement,
        isSelected && !hasSyntaxDiagnostics && statementRendererClasses.expressionElementSelected
    )

    const inputEditorProps: InputEditorProps = {
        model: isOnPlaceholder ? model : model.functionName,
        classNames: styleClassNames,
        notEditable: isOnPlaceholder ? false : true
    }

    const addNewExpression = () => {
        const isEmpty = model.arguments.length === 0;
        const expr = isEmpty ? PARAMETER_PLACEHOLDER : `, ${PARAMETER_PLACEHOLDER}`;
        const newPosition = isEmpty ? {
            ...model.closeParenToken.position,
            endColumn: model.closeParenToken.position.startColumn
        } : {
            startLine: model.arguments[model.arguments.length - 1].position.endLine,
            startColumn: model.arguments[model.arguments.length - 1].position.endColumn,
            endLine: model.closeParenToken.position.startLine,
            endColumn: model.closeParenToken.position.startColumn
        }
        updateModel(expr, newPosition);
    };


    if (!currentModel.model || (currentModel.model.source === FUNCTION_CALL_PLACEHOLDER) || (currentModel.model.source === PARAMETER_PLACEHOLDER)) {
        if (model && STKindChecker.isFunctionCall(model)) {
            changeCurrentModel(model);
        }
    }

    return (
        <>
            <InputEditor {...inputEditorProps} />
            {!isOnPlaceholder && (
                <>
                    <TokenComponent model={model.openParenToken} />
                    <ExpressionArrayComponent expressions={model.arguments} />
                    {hasRestArg && (<NewExprAddButton model={model} onClick={addNewExpression}/>)}
                    <TokenComponent model={model.closeParenToken} />
                </>
            )}
        </>
    );
}
