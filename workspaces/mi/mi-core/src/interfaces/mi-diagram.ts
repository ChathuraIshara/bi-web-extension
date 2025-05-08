/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export type HelperPaneCompletionItem = {
    label: string;
    insertText: string;
    children?: HelperPaneCompletionItem[];
}

export type HelperPaneFunctionCompletionItem = {
    label: string;
    kind: number;
    detail: string;
    sortText: string;
    insertText: string;
    insertTextFormat: number;
}

export type HelperPaneFunctionInfo = {
    [key: string]: {
        items: HelperPaneFunctionCompletionItem[];
        sortText: string;
    };
}

export type HelperPaneData = {
    payload: HelperPaneCompletionItem[];
    variables: HelperPaneCompletionItem[];
    properties: HelperPaneCompletionItem[];
    functions: HelperPaneFunctionInfo;
    configs: HelperPaneCompletionItem[];
    headers: HelperPaneCompletionItem[];
    params: HelperPaneCompletionItem[];
};

export type Namespace = {
    prefix: string;
    uri: string;
}

export type FormExpressionFieldValue = {
    isExpression: boolean;
    fromAI?: boolean;
    value: string;
    namespaces: Namespace[];
    description?: AIDescription;
}

export type AIDescription = {
    defaultValue: string;
    currentValue: string;
}
