/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";

import {
    ExpressionEditorCustomTemplate,
    ExpressionEditorProps
} from "@wso2-enterprise/ballerina-expression-editor";
import {
    DiagramDiagnostic,
    FormElementProps
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";
import {v4 as uuid} from 'uuid';

import { LowCodeExpressionEditor } from "../../../FormFieldComponents/LowCodeExpressionEditor";

import { getVarTypeCompletions } from './utils';

export interface VariableTypeInputProps {
    displayName: string;
    value: string;
    hideLabel?: boolean;
    focus?: boolean;
    onValueChange: (value: string) => void;
    validateExpression: (fieldName: string, isInValid: boolean) => void;
    position: NodePosition;
    overrideTemplate?: ExpressionEditorCustomTemplate;
    hideTextLabel?: boolean;
    disabled?: boolean;
    ignoredCompletions?: string[];
    additionalCompletions?: string[];
    enterKeyPressed?: (value: string) => void;
    initialDiagnostics?: DiagramDiagnostic[];
    diagnosticsFilterExtraColumns?: {
        start?: number,
        end?: number,
    },
    changed?: boolean | string;
    tooltipTitle?: string,
}

export function VariableTypeInput(props: VariableTypeInputProps) {
    const { onValueChange, validateExpression, position, value, displayName, overrideTemplate, hideLabel, disabled,
            ignoredCompletions = [], additionalCompletions = [], focus, enterKeyPressed, initialDiagnostics, diagnosticsFilterExtraColumns, changed, tooltipTitle } = props;

    const [editorFocus, setEditorFocus] = useState<boolean>(focus);

    const revertFocus = () => {
        setEditorFocus(false);
    };
    const [uniqueId] = useState(uuid());
    const expressionEditorNameConfig: FormElementProps<ExpressionEditorProps> = {
        model: {
            name: "variableType",
            displayName,
            isOptional: false,
            value,
        },
        customProps: {
            validate: validateExpression,
            interactive: true,
            editPosition: position,
            customTemplate: overrideTemplate ? overrideTemplate : {
                defaultCodeSnippet: `${value === 'var' ? '' : '|()'}  tempVar_${uniqueId.replaceAll('-', '_')} = ();`,
                targetColumn: 1
            },
            hideExpand: true,
            getCompletions: getVarTypeCompletions(ignoredCompletions, additionalCompletions),
            showHints: false,
            hideTextLabel: hideLabel,
            disabled,
            focus: editorFocus,
            revertFocus,
            enterKeyPressed,
            initialDiagnostics,
            diagnosticsFilterExtraColumns,
            changed,
            tooltipTitle,
        },
        onChange: onValueChange,
        defaultValue: value
    };

    return (
        <LowCodeExpressionEditor {...expressionEditorNameConfig} />
    )
}
