/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CSSProperties, MutableRefObject, ReactNode } from 'react';
import { ActionButtonType, HelperPaneOrigin } from './common';

export type ResizeHandleProps = {
    editorRef: MutableRefObject<HTMLDivElement | null>;
};

type TokenEditorBaseProps = {
    value: string;
    actionButtons?: ActionButtonType[];
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    getExpressionEditorIcon?: () => ReactNode;
    editorSx?: CSSProperties;
};

type HelperPaneConditionalProps =
    | {
          getHelperPane: (onChange: (value: string) => void, addFunction: (signature: string) => void) => JSX.Element;
          helperPaneOrigin?: HelperPaneOrigin;
          changeHelperPaneState: (state: boolean) => void;
          isHelperPaneOpen: boolean;
      }
    | {
          getHelperPane?: never;
          helperPaneOrigin?: never;
          changeHelperPaneState?: never;
          isHelperPaneOpen?: never;
      };

export type TokenEditorProps = TokenEditorBaseProps & HelperPaneConditionalProps;

export type TokenFieldProps = {
    value: string;
    onChange: (value: string) => void;
};
