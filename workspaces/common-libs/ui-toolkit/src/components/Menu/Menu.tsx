/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import React, { PropsWithChildren } from "react";

export interface Item {
    id: number | string;
    label: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}
export interface MenuProps {
    menuItems?: Item[];
    id?: string;
    sx?: any;
}

interface ContainerProps {
    sx?: any;
}

const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: column;
    background-color: var(--vscode-list-activeSelectionForeground);
    box-shadow: var(--vscode-widget-shadow) 0px 4px 10px;
    padding: 8px 0;
    border: 1px solid var(--vscode-editor-lineHighlightBorder);
    background-color: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    ${(props: ContainerProps) => props.sx};
`;

export const Menu: React.FC<PropsWithChildren<MenuProps>> = (props: PropsWithChildren<MenuProps>) => {
    const { children, sx, id } = props;

    return (
        <Container id={id} sx={sx}>
            {children}
        </Container>
    );
};

