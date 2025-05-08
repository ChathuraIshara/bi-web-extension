/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { ExpressionEditorState, FormField, WizardType } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { Diagnostic } from "vscode-languageserver-protocol";

export enum GenerationType {
    ASSIGNMENT,
    NEW
}

export interface FormElementProps<T = {}> extends FormElementEvents {
    model?: FormField | any;
    index?: number;
    customProps?: T;
    defaultValue?: any;
    placeholder?: string;
    label?: string;
    rowsMax?: number;
    errorMessage?: string;
    validateEmptyField?: (field: string, isEmpty: boolean) => void;
    onFieldValueChange?: (isRequiredFieldsFilled: boolean) => void;
    size?: "small" | "medium";
    type?: "string" | "number" | "array" | "record" | "|" | "varref" | "int" | "float" | "boolean" | "json" | "var";
    editorDiagnostics?: Diagnostic[];
    mainDiagnostics?: Diagnostic[];
    targetPositionDraft?: any;
    disabled?: boolean;
    dataTestId?: string;
    currentValue?: string;
    tooltip?: string;
    hideLabelTooltips?: boolean;
    hideLabel?: boolean;
}

export interface FormElementEvents {
    // Should use either KeyUp or OnChange callBack
    onChange?: (event: any) => void;
    // This callback is to detect KeyUp event
    onKeyUp?: (event: any) => void;
    // This callback is to detect focus out
    onBlur?: (event: any) => void;
    onClick?: () => void;
    onFocus?: (event: any) => void;
    dispatchExprEditorStart?: (editor: ExpressionEditorState) => void;
    dispatchExprEditorContentChange?: (editor: ExpressionEditorState) => void;
    dispatchExprEditorClose?: (editor: ExpressionEditorState) => void;
}

export interface FormFieldChecks {
    name: string;
    isValid: boolean;
    isEmpty?: boolean;
    canIgnore?: boolean; // Ff field is optional or defaultable
}
