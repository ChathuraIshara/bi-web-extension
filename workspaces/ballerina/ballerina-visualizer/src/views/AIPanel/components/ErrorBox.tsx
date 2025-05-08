/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { Codicon } from "@wso2-enterprise/ui-toolkit";
import React from "react";

const Container = styled.div`
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    margin-top: 1em;
    gap: 12px;
    padding: 8px;
    border: 1px solid var(--vscode-inputValidation-errorBorder);
    border-radius: 4px;
    color: var(--vscode-inputValidation-errorForeground);
    max-width: 100%;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-color: var(--vscode-inputValidation-errorBorder);
        opacity: 0.15;
        z-index: 0;
    }

    > * {
        position: relative;
        z-index: 1;
    }
`;

const ErrorText = styled.span`
    word-break: break-word;
`;

interface ErrorBoxProps {
    children: React.ReactNode;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ children }) => {
    return (
        <Container>
            <Codicon name="error" />
            <ErrorText>{children}</ErrorText>
        </Container>
    );
};

export default ErrorBox;
