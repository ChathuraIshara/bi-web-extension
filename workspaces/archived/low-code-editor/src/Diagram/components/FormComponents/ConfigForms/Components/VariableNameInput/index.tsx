/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { ExpressionEditorCustomTemplate, ExpressionEditorProps } from "@wso2-enterprise/ballerina-expression-editor";
import {
    DiagramDiagnostic,
    FormElementProps
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { LowCodeExpressionEditor } from "../../../FormFieldComponents/LowCodeExpressionEditor";
import { wizardStyles as useFormStyles } from "../../style";

export interface VariableNameInputProps {
    displayName: string;
    value: string;
    isEdit: boolean;
    onValueChange: (value: string) => void;
    validateExpression: (fieldName: string, isInValid: boolean) => void;
    position: NodePosition;
    overrideTemplate?: ExpressionEditorCustomTemplate;
    overrideEditTemplate?: ExpressionEditorCustomTemplate;
    hideLabel?: boolean;
    initialDiagnostics?: DiagramDiagnostic[];
    diagnosticsFilterExtraColumns?: {
        start?: number,
        end?: number,
    };
    disabled?: boolean;
    hideSuggestions?: boolean;
    focus?: boolean;
    revertFocus?: () => void
}

export function VariableNameInput(props: VariableNameInputProps) {
    const { onValueChange, validateExpression, revertFocus, focus, position, value, displayName, overrideTemplate, overrideEditTemplate, isEdit, hideLabel, initialDiagnostics, diagnosticsFilterExtraColumns, disabled, hideSuggestions = true } = props;
    const formClasses = useFormStyles();

    let customTemplate;

    if (isEdit) {
        if (overrideEditTemplate) {
            customTemplate = overrideEditTemplate;
        } else {
            customTemplate = {
                defaultCodeSnippet: '',
                targetColumn: 0
            }
        }
    } else {
        if (overrideTemplate) {
            customTemplate = overrideTemplate;
        } else {
            customTemplate = {
                defaultCodeSnippet: `var  = 10;`,
                targetColumn: 5,
            };
        }
    }

    const expressionEditorNameConfig: FormElementProps<ExpressionEditorProps> = {
        model: {
            name: "variableName",
            displayName,
            isOptional: false
        },
        customProps: {
            validate: validateExpression,
            revertFocus,
            focus,
            interactive: true,
            editPosition: {
                startLine: position.startLine,
                endLine: position.endLine,
                startColumn: position.startColumn,
                endColumn: position.endColumn
            },
            customTemplate,
            hideSuggestions,
            hideExpand: true,
            hideTextLabel: hideLabel,
            initialDiagnostics,
            diagnosticsFilterExtraColumns,
            disabled
        },
        onChange: onValueChange,
        defaultValue: value
    };

    return (
        <div className={formClasses.expStatementWrapper}>
            <LowCodeExpressionEditor {...expressionEditorNameConfig} />
        </div>
    )
}
