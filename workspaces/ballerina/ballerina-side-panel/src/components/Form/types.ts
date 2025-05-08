/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RefObject } from "react";
import { DiagnosticMessage, FormDiagnostics, TextEdit, PropertyModel, LinePosition, LineRange, ExpressionProperty, Metadata, RecordTypeField, Imports  } from "@wso2-enterprise/ballerina-core";
import { ParamConfig } from "../ParamManager/ParamManager";
import { CompletionItem, FormExpressionEditorRef, HelperPaneHeight, HelperPaneOrigin, OptionProps } from "@wso2-enterprise/ui-toolkit";

export type FormValues = {
    [key: string]: any;
};

export type FormField = {
    key: string;
    label: string;
    type: null | string;
    optional: boolean;
    advanced?: boolean;
    editable: boolean;
    hidden?: boolean;
    placeholder?: string;
    defaultValue?: string;
    documentation: string;
    value: string | any[];
    advanceProps?: FormField[];
    valueType?: string;
    diagnostics?: DiagnosticMessage[];
    items?: string[];
    itemOptions?: OptionProps[]
    choices?: PropertyModel[];
    dynamicFormFields?: { [key: string]: FormField[] }
    paramManagerProps?: ParamConfig;
    valueTypeConstraint: string | string[];
    groupNo?: number;
    groupName?: string;
    addNewButton?: boolean;
    addNewButtonLabel?: string;
    enabled: boolean;
    lineRange?: LineRange;
    metadata?: Metadata;
    codedata?: {[key: string]: any};
    imports?: {[key: string]: string};
};

export type ParameterValue = {
    value: {
        variable: { value: string };
        type: { value: string };
        parameterDescription: { value: string };
    };
};

export type ExpressionFormField = {
    key: string;
    value: string;
    cursorPosition: LinePosition;
    isConfigured?: boolean
};

export type HelperPaneCompletionItem = {
    label: string;
    type?: string;
    insertText: string;
    kind?: string;
    codedata?: any;
}

export type HelperPaneCompletionCategory = {
    label: string;
    items: HelperPaneCompletionItem[];
}

export type HelperPaneVariableInfo = {
    category: HelperPaneCompletionCategory[];
}

export type HelperPaneFunctionCategory = {
    label: string;
    items?: HelperPaneCompletionItem[];
    subCategory?: HelperPaneFunctionCategory[];
}

export type HelperPaneFunctionInfo = {
    category: HelperPaneFunctionCategory[];
}

export type HelperPaneData = HelperPaneVariableInfo | HelperPaneFunctionInfo;

type FormCompletionConditionalProps = {
    completions: CompletionItem[];
    triggerCharacters: readonly string[];
    retrieveCompletions: (
        value: string,
        property: ExpressionProperty,
        offset: number,
        triggerCharacter?: string
    ) => Promise<void>;
    extractArgsFromFunction?: (
        value: string,
        property: ExpressionProperty,
        cursorPosition: number
    ) => Promise<{
        label: string;
        args: string[];
        currentArgIndex: number;
    }>;
} | {
    completions?: never;
    triggerCharacters?: never;
    retrieveCompletions?: never;
    extractArgsFromFunction?: never;
}

type FormTypeConditionalProps = {
    types: CompletionItem[];
    referenceTypes: CompletionItem[];
    retrieveVisibleTypes: (
        value: string,
        cursorPosition: number,
        fetchReferenceTypes: boolean,
        valueTypeConstraint: string
    ) => Promise<void>;
    getTypeHelper: (
        fieldKey: string,
        valueTypeConstraint: string,
        typeBrowserRef: RefObject<HTMLDivElement>,
        currentType: string,
        currentCursorPosition: number,
        typeHelperState: boolean,
        onChange: (newType: string, newCursorPosition: number) => void,
        changeTypeHelperState: (isOpen: boolean) => void,
        helperPaneHeight: HelperPaneHeight,
        onTypeCreate: () => void,
    ) => JSX.Element;
    helperPaneOrigin?: HelperPaneOrigin;
    helperPaneHeight: HelperPaneHeight;
} | {
    types?: never;
    referenceTypes?: never;
    retrieveVisibleTypes?: never;
    getTypeHelper?: never;
    helperPaneOrigin?: never;
    helperPaneHeight?: never;
}

type FormHelperPaneConditionalProps = {
    getHelperPane: (
        fieldKey: string,
        exprRef: RefObject<FormExpressionEditorRef>,
        anchorRef: RefObject<HTMLDivElement>,
        defaultValue: string,
        value: string,
        onChange: (value: string, updatedCursorPosition: number) => void,
        changeHelperPaneState: (isOpen: boolean) => void,
        helperPaneHeight: HelperPaneHeight,
        recordTypeField?: RecordTypeField,
        isAssignIdentifier?: boolean
    ) => JSX.Element;
    helperPaneOrigin?: HelperPaneOrigin;
    helperPaneHeight: HelperPaneHeight;
} | {
    getHelperPane?: never;
    helperPaneOrigin?: never;
    helperPaneHeight?: never;
}

type FormExpressionEditorBaseProps = {
    growRange?: { start: number; offset: number };
    getExpressionEditorDiagnostics?: (
        showDiagnostics: boolean,
        expression: string,
        key: string,
        property: ExpressionProperty
    ) => Promise<void>;
    getExpressionFormDiagnostics?: (
        showDiagnostics: boolean,
        expression: string,
        key: string,
        property: ExpressionProperty,
        setDiagnosticsInfo: (diagnostics: FormDiagnostics) => void,
        shouldUpdateNode?: boolean,
        variableType?: string
    ) => Promise<void>;
    onCompletionItemSelect?: (value: string, fieldKey: string, additionalTextEdits?: TextEdit[]) => Promise<void>;
    onFocus?: () => void | Promise<void>;
    onBlur?: () => void | Promise<void>;
    onCancel?: () => void;
    onSave?: (value: string) => void | Promise<void>;
    onRemove?: () => void;
    onSaveConfigurables?: (values: any) => void;
}

type SanitizedExpressionEditorProps = {
    rawExpression?: (expression: string) => string; // original expression
    sanitizedExpression?: (expression: string) => string; // sanitized expression that will be rendered in the editor
}

export type FormExpressionEditorProps =
    FormCompletionConditionalProps &
    FormTypeConditionalProps &
    FormHelperPaneConditionalProps &
    FormExpressionEditorBaseProps &
    SanitizedExpressionEditorProps;

export type FormImports = {
    [fieldKey: string]: Imports;
}
