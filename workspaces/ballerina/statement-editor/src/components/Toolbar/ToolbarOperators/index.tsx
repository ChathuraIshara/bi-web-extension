/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import React, { useContext, useEffect, useState } from "react";

import { STKindChecker } from "@wso2-enterprise/syntax-tree";
import { Button } from "@wso2-enterprise/ui-toolkit";

import {
    CONFIGURABLE_VALUE_REQUIRED_TOKEN
} from "../../../constants";
import { InputEditorContext } from "../../../store/input-editor-context";
import { StatementEditorContext } from "../../../store/statement-editor-context";
import {
    getRecordFieldSource,
    getRecordSwitchedSource,
    getRecordUpdatePosition, isRecordFieldName
} from "../../../utils";
import {
    binaryBitwise,
    checking,
    equality,
    Expression,
    ExpressionGroup,
    EXPR_PLACEHOLDER,
    listBindingPattern,
    logical,
    memberAccess,
    operators,
    optionalRecordField,
    parenthesis,
    range,
    relational,
    SELECTED_EXPRESSION,
    trap,
    typeDesc
} from "../../../utils/expressions";
import { ModelType } from "../../../utils/statement-editor-viewstate";
import { useStatementEditorToolbarStyles } from "../../styles";

import {
    ARITHMETIC_OPERATORS,
    binaryBitwiseOperators,
    BINARYBITWISE_OPERATORS,
    checkingOperators,
    CHECKING_OPERATORS,
    equalityOperators,
    EQUALITY_OPERATORS,
    logicalOperators,
    LOGICAL_OPERATORS,
    operatorsEdits,
    optionalRecordFieldOperators,
    OPTIONALRECORDFIELD_OPERATORS,
    plusOperator,
    rangeOperators,
    RANGE_OPERATORS,
    relationalOperators,
    RELATIONAL_OPERATORS,
    trapOperators,
    TRAP_OPERATORS
} from "./utils/operators";

export function ToolbarOperators() {
    const statementEditorToolbarClasses = useStatementEditorToolbarStyles();
    const inputEditorCtx = useContext(InputEditorContext);
    const [filteredExpressions, setFilteredExpressions] = useState([operators]);

    const {
        modelCtx: {
            currentModel,
            updateModel,
        },
        config
    } = useContext(StatementEditorContext);

    const updateModelWithOperator = (expression: Expression) => {
        const currentModelSource = STKindChecker.isOrderKey(currentModel.model) ? currentModel.model.expression.source :
            (currentModel.model.source ? currentModel.model.source.trim() : currentModel.model.value.trim());
        let text;
        let updatePosition = currentModel.model.position;
        if (STKindChecker.isRecordField(currentModel.model)) {
            text = expression.template.replace(SELECTED_EXPRESSION, getRecordFieldSource(currentModel.model));
        } else if (STKindChecker.isRecordTypeDesc(currentModel.model) && expression.name ===
            "Switches Open/Close record to Close/Open") {
            text = expression.template.replace(SELECTED_EXPRESSION, getRecordSwitchedSource(currentModel.model));
            updatePosition = getRecordUpdatePosition(currentModel.model)
        } else {
            text = currentModelSource !== CONFIGURABLE_VALUE_REQUIRED_TOKEN
                ? expression.template.replace(SELECTED_EXPRESSION, currentModelSource)
                : expression.template.replace(SELECTED_EXPRESSION, EXPR_PLACEHOLDER);
        }
        updateModel(text, updatePosition)
        inputEditorCtx.onInputChange('');
        inputEditorCtx.onSuggestionSelection(text);
    }

    useEffect(() => {
        if (currentModel.model) {
            let filteredGroups: ExpressionGroup[];

            // filter context based toolbar operators on statement
            switch (config.type) {
                case "Variable" || "AssignmentStatement":
                    filteredGroups = [operators, parenthesis];
                    break;
                case "If":
                    filteredGroups = [logical, equality, relational, binaryBitwise];
                    break;
                case "While":
                    filteredGroups = [relational, equality];
                    break;
                case "ForEach":
                    filteredGroups = [range]
                    break;
                case "Call" || "Log":
                    filteredGroups = [checking, trap]
                    break;
                case "Return":
                    filteredGroups = [parenthesis, operators];
                    break;
                case "Configurable":
                    filteredGroups = [optionalRecordField]
                    break;
                case "ConstDeclaration":
                    filteredGroups = [operators];
                    break;
                default:
                    filteredGroups = [operators]
                    break;
            }

            // filter context based toolbar operators on expression
            if (currentModel?.model?.viewState?.modelType && (currentModel.model.viewState.modelType === ModelType.OPERATOR)) {
                filteredGroups = [operatorsEdits]
                if (STKindChecker.isPlusToken(currentModel.model) && STKindChecker.isBinaryExpression(currentModel.model.parent)
                    && STKindChecker.isStringLiteral(currentModel.model.parent.lhsExpr)
                    && STKindChecker.isStringLiteral(currentModel.model.parent.rhsExpr)) {
                        filteredGroups = [plusOperator]

                // filter context based toolbar operators on operator selected
                } else if (currentModel?.model?.value) {
                    if (ARITHMETIC_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [operatorsEdits];
                    } else if (LOGICAL_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [logicalOperators];
                    } else if (EQUALITY_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [equalityOperators];
                    } else if (RELATIONAL_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [relationalOperators];
                    } else if (BINARYBITWISE_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [binaryBitwiseOperators];
                    } else if (RANGE_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [rangeOperators];
                    } else if (CHECKING_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [checkingOperators];
                    } else if (TRAP_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [trapOperators];
                    } else if (OPTIONALRECORDFIELD_OPERATORS.includes(currentModel.model.value)) {
                        filteredGroups = [optionalRecordFieldOperators];
                    }
                }
            } else if (STKindChecker.isSelectClause(currentModel.model) || STKindChecker.isLetClause(currentModel.model)) {
                filteredGroups = [operators, parenthesis];
            } else if (currentModel?.model?.viewState?.isWithinWhereClause) {
                filteredGroups = [relational, equality];
            } else if (isRecordFieldName(currentModel.model)) {
                filteredGroups = [optionalRecordField]
            } else if (currentModel?.model?.viewState.modelType === ModelType.TYPE_DESCRIPTOR) {
                filteredGroups = [typeDesc]
            } else if (config.type === "AssignmentStatement" && STKindChecker.isIdentifierToken(currentModel.model)) {
                filteredGroups = [listBindingPattern, memberAccess]
            }

            setFilteredExpressions(filteredGroups);
        }
    }, [currentModel.model]);

    return (
        <div className={statementEditorToolbarClasses.toolbarOperators} data-testid="toolbar-operators">
            {filteredExpressions.map((group, groupIndex) => (
                <div className={statementEditorToolbarClasses.toolbarOperators} key={groupIndex}>
                    {
                        group.expressions.map((expression, index) => (
                            <Button
                                key={index}
                                appearance="icon"
                                onClick={() => updateModelWithOperator(expression)}
                                tooltip={expression.name}
                                className={statementEditorToolbarClasses.toolbarOperatorsIcons}
                            >
                                <div style={{ fontFamily: 'monospace' }}>{expression.symbol}</div>
                            </Button>
                        ))
                    }
                </div>
            ))}
        </div>
    );
}
