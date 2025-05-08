/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { MutableRefObject, ReactNode } from 'react';
import { ActionButtonType, ExpressionEditorProps, ExpressionEditorRef, HelperPaneHeight, HelperPaneOrigin } from './common';

type HelperPaneConditionalProps = {
    // - Whether the helper pane is open
    isHelperPaneOpen: boolean;
    // - Position of the helper pane
    helperPaneOrigin?: HelperPaneOrigin;
    // - Height of the helper pane
    helperPaneHeight?: HelperPaneHeight;
    // - Width of the helper pane
    helperPaneWidth?: number;
    // - Callback function to open/close the helper pane
    changeHelperPaneState: (isOpen: boolean) => void;
    // - Get the helper panel component
    getHelperPane: (
        value: string,
        onChange: (value: string, updatedCursorPosition: number) => void,
        helperPaneHeight: HelperPaneHeight
    ) => ReactNode;
    // - Get a custom icon for the expression editor
    getExpressionEditorIcon?: () => ReactNode;
} | {
    isHelperPaneOpen?: never;
    helperPaneOrigin?: never;
    helperPaneHeight?: never;
    helperPaneWidth?: never;
    changeHelperPaneState?: never;
    getHelperPane?: never;
    getExpressionEditorIcon?: never;
}

export type FormExpressionEditorProps = ExpressionEditorProps & HelperPaneConditionalProps & {
    resize?: 'vertical' | 'disabled';
    growRange?: { start: number, offset: number };
    actionButtons?: ActionButtonType[];
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    anchorRef?: MutableRefObject<HTMLDivElement>;
    expressionEditorIconName?: string;
    enableExIcon?: boolean;
};

export type FormExpressionEditorElProps = FormExpressionEditorProps & {
    containerRef: MutableRefObject<HTMLDivElement>;
}

export type FormExpressionEditorRef = ExpressionEditorRef & {
    focus: (manualTrigger?: boolean) => void;
    inputElement: HTMLTextAreaElement;
    parentElement: HTMLElement;
    setCursor: (value: string, cursorPosition: number) => void;
};
