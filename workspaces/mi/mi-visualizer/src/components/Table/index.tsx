/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { FormCheckBox } from "@wso2-enterprise/ui-toolkit";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

export type Entry = {
    id: string;
    name: string;
    get: boolean;
    post?: boolean;
    put?: boolean;
    delete?: boolean;
}

export type TableProps<T extends FieldValues> = UseControllerProps<T> & {
    name: string;
};

const TableContainer = styled.div`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeader = styled.div`
    display: flex;
    background-color: var(--vscode-tab-selectedBackground);
    padding: 4px 8px;
    font-weight: bold;
`;

const TableRow = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-bottom: 1px solid var(--vscode-tab-border);
`;

const TableName = styled.div`
    width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: 8px;
    text-align: start;
`;

const TableCell = styled.div`
    flex: 1;
    padding: 8px;
    text-align: center;
`;

const DisabledCell = styled(TableCell)`
    flex: 1;
    padding: 8px;
    background-color: var(--vscode-tab-unselectedBackground);
`;

export const Table = <T extends FieldValues>({ control, name }: TableProps<T>) => {
    const {
        field: { value: entries }
    } = useController({ name, control });

    return (
        <TableContainer>
            <TableHeader>
                <TableName>Table Name</TableName>
                <TableCell>GET</TableCell>
                <TableCell>POST</TableCell>
                <TableCell>PUT</TableCell>
                <TableCell>DELETE</TableCell>
            </TableHeader>
            {entries.map((entry: Entry, index: number) => (
                <TableRow key={index}>
                    <TableName>{entry.name}</TableName>
                    <TableCell>
                        <FormCheckBox name={`${entry.id}.get`} control={control} />
                    </TableCell>
                    <TableCell>
                        {entry.post !== undefined ? (
                            <FormCheckBox name={`${entry.id}.post`} control={control} />
                        ) : (
                            <DisabledCell />
                        )}
                    </TableCell>
                    <TableCell>
                        {entry.put !== undefined ? (
                            <FormCheckBox name={`${entry.id}.put`} control={control} />
                        ) : (
                            <DisabledCell />
                        )}
                    </TableCell>
                    <TableCell>
                        {entry.delete !== undefined ? (
                            <FormCheckBox name={`${entry.id}.delete`} control={control} />
                        ) : (
                            <DisabledCell />
                        )}
                    </TableCell>
                </TableRow>
            ))}
        </TableContainer>
    );
};

