/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: no-explicit-any
import { css, cx } from "@emotion/css";
import { CSSObject } from "@emotion/react";
import styled from "@emotion/styled";

export const EditorContainer = styled.div<CSSObject>`
    display: flex;
    margin: 10px 0;
    flex-direction: column;
    border-radius: 5px;
    padding: 10px;
    border: 1px solid var(--vscode-dropdown-border);
`;

export const EditorContent = styled.div<CSSObject>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 0;
`;

export const ContentSection = styled.div<CSSObject>`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

export const EditIconWrapper = styled.div<CSSObject>`
    cursor: pointer;
    height: 14px;
    width: 14px;
    margin-top: 16px;
    margin-bottom: 13px;
    margin-left: 10px;
    color: var(--vscode-statusBarItem-remoteBackground);
`;

export const DeleteIconWrapper = styled.div<CSSObject>`
    cursor: pointer;
    height: 14px;
    width: 14px;
    margin-top: 16px;
    margin-bottom: 13px;
    margin-left: 10px;
    color: var(--vscode-notificationsErrorIcon-foreground);
`;

export const IconWrapper = styled.div<CSSObject>`
    cursor: pointer;
    height: 14px;
    width: 14px;
    margin-top: 16px;
    margin-bottom: 13px;
    margin-left: 10px;
`;

export const IconTextWrapper = styled.div<CSSObject>`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    width: 225px;
    cursor: pointer;
    background-color: var(--vscode-inputValidation-infoBackground);
    height: 100%;
`;

// eslint-disable-next-line react-refresh/only-export-components
export const headerLabelStyles = cx(css`
    display: flex;
    align-items: center;
    width: 320px;
    cursor: pointer;
    margin-left: 12px;
    line-height: 14px;
`);

export const OptionLabel = styled.div<CSSObject>`
    font-size: 12px;
    line-height: 14px;
    margin-left: 5px;
`;

// eslint-disable-next-line react-refresh/only-export-components
export const disabledHeaderLabel = cx(css`
    display: flex;
    align-items: center;
    width: 320px;
    margin-left: 12px;
    line-height: 14px;
`);

export const HeaderLabel = styled.div<CSSObject>`
    display: flex;
    background: var(--vscode-editor-background);
    border: 1px solid ${(props: { haveErrors: boolean; }) => props.haveErrors ? "red" : "var(--vscode-dropdown-border)"};
    margin-top: 8px;
    display: flex;
    width: 100%;
    height: 32px;
    align-items: center;
`;

export const ActionIconWrapper = styled.div<CSSObject>`
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 14px;
    width: 14px;
`;

export const ParamContainer = styled.div<CSSObject>`
    display: flex;
    align-items: center;
`;

export const ParamDescription = styled.div<CSSObject>`
    display: flex;
    padding: 10px;
`;
