/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { css, cx } from "@emotion/css";
import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    background-color: var(--vscode-toolbar-activeBackground);
    padding: 6px;
`;

const ErrorMsg = styled.div`
    white-space: break-spaces;
`;

const codiconStyles = css`
    color: var(--vscode-errorForeground);
    margin-right: 6px;
    vertical-align: middle;
`;

export const ErrorIcon = cx(css`
    color: var(--vscode-errorForeground);
`);

export function ErrorBanner(props: { id?: string, className?: string, errorMsg: string }) {
    const { id, className, errorMsg } = props;

    return (
        <Container id={id} className={className}>
            <i className={`codicon codicon-warning ${cx(codiconStyles)}`} />
            <ErrorMsg>{errorMsg}</ErrorMsg>
        </Container>
    );
}
