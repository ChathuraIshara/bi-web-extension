/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { h, FunctionComponent } from 'preact';
import { Json } from '../json/json';
import {
    CODE_EDITOR_COLORS,
    DEFAULT_FONT_STYLE,
    JSON_DARK_THEME,
    JSON_LIGHT_THEME,
} from '../themes';
import { NotebookCellResult } from '../types';
import { getIsDarkMode } from '../utils';

interface TableProps {
    header: string[];
    values: Object[];
}

export const Table: FunctionComponent<{
    tableContent: Readonly<TableProps>;
}> = ({ tableContent }) => {
    const darkMode = getIsDarkMode();
    const tableContentValues = tableContent.values;
    const getValue = (element: { [x: string]: any }, key: string | number) =>
        element[key] ?? null;

    const renderHeader = () => {
        return tableContent.header.map((key) => {
            return (
                <th
                    key={key}
                    style={{ textAlign: 'center', letterSpacing: '0.05em' }}
                >
                    {key}
                </th>
            );
        });
    };

    const renderBody = () => {
        let body: h.JSX.Element[] = [];
        for (let index = 0; index < tableContentValues.length; index++) {
            body.push(
                <tr>
                    {tableContent.header.map((key) => {
                        let value = getValue(tableContentValues[index], key);
                        return (
                            <td style={{ textAlign: 'left' }}>
                                {value === Object(value) ? (
                                    <Json
                                        value={value}
                                        theme={darkMode ? JSON_DARK_THEME : JSON_LIGHT_THEME}
                                        collapsed={1}
                                    />
                                ) : (
                                    value != null && (
                                        <pre
                                            style={{ 
                                                ...DEFAULT_FONT_STYLE,
                                                color: darkMode ? CODE_EDITOR_COLORS.WHITE : CODE_EDITOR_COLORS.DARKER,
                                            }}
                                        >
                                            {JSON.stringify(value, undefined, 2)}
                                        </pre>
                                    )
                                )}
                            </td>
                        );
                    })}
                </tr>
            );
        }
        return body;
    };

    const renderTable = () => {
        return (
            <table>
                <thead>{renderHeader()}</thead>
                <tbody>{renderBody()}</tbody>
            </table>
        );
    };
    return <div>{renderTable()}</div>;
};

export const TableForNotebookOutput: FunctionComponent<{
    notebookCellOutput: Readonly<NotebookCellResult>;
}> = ({ notebookCellOutput }) => {
    const values = JSON.parse(notebookCellOutput.shellValue.value);

    if (!values.length) {
        return (
            <p style={{ ...DEFAULT_FONT_STYLE, textAlign: 'left' }}>
                Empty table!
            </p>
        );
    }

    const getKeys = () => {
        let cols = [];
        for (var i = 0; i < values.length; i++) {
            for (var key in values[i]) {
                if (cols.indexOf(key) === -1) {
                    cols.push(key);
                }
            }
        }
        return cols;
    };

    const tableProps = {
        header: getKeys(),
        values: values,
    };
    return (
        <div
            style={{
                ...DEFAULT_FONT_STYLE,
                maxHeight: '600px',
                overflowY: 'scroll',
            }}
        >
            <Table tableContent={tableProps} />
        </div>
    );
};
