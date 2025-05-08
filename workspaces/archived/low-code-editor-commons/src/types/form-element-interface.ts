import React from "react";

import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";
import { Diagnostic } from "vscode-languageserver-protocol";

import { FormField } from "./config-spec"
import { ExpressionConfigurableProps } from "./expression-configurable-interface";
import { ExpressionEditorLangClientInterface } from "./expression-editor-lang-client-interface";
import { CurrentFile } from "./lang-client-extended";
import { ExpressionEditorState } from "./store";

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
    expressionConfigurable?: React.FC<ExpressionConfigurableProps>;
    currentFile?: CurrentFile;
    langServerURL?: string;
    syntaxTree?: STNode;
    getExpressionEditorLangClient?: () => Promise<ExpressionEditorLangClientInterface>;
    lowCodeResourcesVersion?: string;
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
