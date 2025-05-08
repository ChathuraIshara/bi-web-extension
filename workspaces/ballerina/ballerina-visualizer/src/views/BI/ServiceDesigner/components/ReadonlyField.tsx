/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { Button, Icon, RequiredFormInput, Tooltip } from "@wso2-enterprise/ui-toolkit";
import styled from "@emotion/styled";

interface ReadonlyFieldProps {
    label: string;
    name: string;
}

const Container = styled.div`
    width: 100%;
    cursor: not-allowed;
`;

const Label = styled.div`
    color: var(--vscode-editor-foreground);
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
    display: flex;
    flex-direction: row;
    margin-bottom: 4px;
`;

const Description = styled.div`
    font-family: var(--font-family);
    color: var(--vscode-list-deemphasizedForeground);
    margin-top: 4px;
    color: var(--vscode-list-deemphasizedForeground);
    margin-bottom: 4px;
    text-align: left;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    color: var(--input-foreground);
    background: var(--input-background);
    border-radius: calc(var(--corner-radius)* 1px);
    border: calc(var(--border-width)* 1px) solid var(--dropdown-border);
    height: calc(var(--input-height)* 1px);
    min-width: var(--input-min-width);
    padding: 0 calc(var(--design-unit) * 2px + 1px);
    margin-top: 10px;
`;

const Value = styled.span`
    flex: 1;
`;

const StyledButton = styled(Button)`
    padding: 0;
    margin-right: -6px;
    cursor: not-allowed;

    :host([disabled]) {
        opacity: 1 !important;
    }

    &.ms-Button--disabled {
        opacity: 1 !important;
    }

    & .codicon {
        opacity: 1 !important;
        color: var(--vscode-input-foreground) !important;
    }
`;

export function ReadonlyField(props: ReadonlyFieldProps) {
    const { label, name } = props;

    return (
        <Container>
            <Label>
                <div style={{ color: "var(--vscode-editor-foreground)" }}>
                    <label>{label}</label>
                </div>
            </Label>
            <InputContainer>
                <Value>{name}</Value>
                <Tooltip content="Read only field">
                    <StyledButton appearance="icon" disabled>
                        <Icon name="bi-lock" sx={{ fontSize: 16, width: 16, height: 16 }} />
                    </StyledButton>
                </Tooltip>
            </InputContainer>
        </Container>
    );
}
