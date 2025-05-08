/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import {
    GAP_BETWEEN_FIELDS,
    GAP_BETWEEN_NODE_HEADER_AND_BODY,
    IO_NODE_DEFAULT_WIDTH,
    IO_NODE_HEADER_HEIGHT
} from "../../../utils/constants";

export const TreeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${GAP_BETWEEN_NODE_HEADER_AND_BODY}px;
    background: var(--vscode-sideBar-background);
    border: 1px solid var(--vscode-welcomePage-tileBorder);
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 24px;
    width: ${IO_NODE_DEFAULT_WIDTH}px;
`;

export const SharedContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: var(--vscode-sideBar-background);
    border: 1px solid var(--vscode-welcomePage-tileBorder);
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 24px;
    width: ${IO_NODE_DEFAULT_WIDTH}px;
`;

export const TreeHeader = styled.div((
    { isSelected, isDisabled }: { isSelected?: boolean, isDisabled?: boolean }
) => ({
    height: `${IO_NODE_HEADER_HEIGHT}px`,
    padding: '8px',
    background: 'none',
    borderRadius: '3px',
    width: '100%',
    display: 'flex',
        cursor: `${isDisabled ? 'not-allowed' : 'pointer'}`,
    '&:hover': {
        backgroundColor: `${isDisabled ? 'var(--vscode-tab-inactiveBackground)' : 'var(--vscode-list-hoverBackground)'}`
    },
    color: 'var(--vscode-inputOption-activeForeground)'
}));

export const TreeBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1px;
    gap: ${GAP_BETWEEN_FIELDS}px;
    background: none;
    border-radius: 3px;
    flex: none;
    flex-grow: 0;
    width: 100%;
    cursor: pointer;
    color: var(--vscode-foreground);
`;

export const ObjectFieldAdder = styled.div`
    height: 40px;
    width: 100%;
    padding: 8px;
    background: repeating-linear-gradient(
        -45deg,
        var(--vscode-button-secondaryBackground),
        var(--vscode-button-secondaryBackground) 3px,
        var(--vscode-button-secondaryHoverBackground) 3px,
        var(--vscode-button-secondaryHoverBackground) 6px
    );
    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;
    &:hover {
        background-color: var(--vscode-list-hoverBackground);
    };
    &:active {
        opacity: 0.6;
    }
`
