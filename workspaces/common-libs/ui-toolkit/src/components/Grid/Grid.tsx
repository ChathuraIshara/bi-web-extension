/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode, PropsWithChildren } from "react";

import styled from "@emotion/styled";
import { VSCodeDataGrid, VSCodeDataGridRow, VSCodeDataGridCell } from "@vscode/webview-ui-toolkit/react";

interface DataGridCellProps {
    selected?: boolean;
}
export const DataGridRow = styled(VSCodeDataGridRow)`
    &:hover {
        background: none;
    }
`;

export const DataGridCell = styled(VSCodeDataGridCell) <DataGridCellProps>`
    background: ${(props: DataGridCellProps) => props.selected ? 'var(--vscode-list-activeSelectionBackground)' : 'var(--vscode-editor-background)'};
    border: ${(props: DataGridCellProps) => props.selected ? '1px var(--vscode-list-focusOutline) solid' : 'none'};
    &:hover {
        background: var(--vscode-list-hoverBackground);
        cursor: pointer;
    };
    &:active {
        background: var(--vscode-list-activeSelectionBackground);
    };
`;

export const DataGridEmptyCell = styled(VSCodeDataGridCell)`
    background: var(--vscode-editor-background);
    border: none;
`;

export interface GridProps {
    id?: string;
    className?: string;
    columns?: number;
    sx?: React.CSSProperties;
}

const generateRowData = (numColumns: number, children: ReactNode) => {
    const gridItems = React.Children.toArray(children);
    const rowData: ReactNode[] = [];
    const columnTemplate = Array.from({ length: numColumns }, () => '1fr').join(' ');
    for (let i = 0; i < gridItems.length; i += numColumns) {
        const row = [];
        for (let j = 0; j < numColumns; j++) {
            row.push(gridItems[i + j]);
        }
        rowData.push(
            <DataGridRow grid-template-columns={columnTemplate} key={rowData?.length}>
                {row.map((cell, index) => {
                    const selectedCell = cell && (cell as any).props.selected;
                    return cell ? (
                        <DataGridCell
                            key={`cell${i+index}`}
                            grid-column={index + 1}
                            selected={selectedCell}
                        >
                            {cell}
                        </DataGridCell>
                    ) : (
                        <DataGridEmptyCell grid-column={index + 1}/>
                    );
                })}
            </DataGridRow>
        );
    }
    return rowData;
};

export const Grid: React.FC<PropsWithChildren<GridProps>> = (props: PropsWithChildren<GridProps>) => {
    const { children, columns } = props;
    const numberOfChildren = React.Children.count(children);
    const rowData = numberOfChildren > 0 ? columns ? generateRowData(columns, children) : generateRowData(numberOfChildren, children) : [];

    return (
        <VSCodeDataGrid>
            {rowData}
        </VSCodeDataGrid>
    );
};
