/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";

interface SidePanelProps {
    sx?: any;
}

export const SidePanelBody = styled.div`
    height: calc(100% - 87px); // 87px is the height of the title container and top and down paddings (55px + 16px + 16px)
    padding: 16px;
    overflow-y: scroll;
`;

export const SidePanelTitleContainer = styled.div<SidePanelProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--vscode-panel-border);
    font: inherit;
    font-weight: bold;
    color: var(--vscode-editor-foreground);
    ${(props: SidePanelProps) => props.sx};
`;
