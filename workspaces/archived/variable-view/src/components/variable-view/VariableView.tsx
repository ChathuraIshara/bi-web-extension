/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState, useEffect } from "react";
import "./style.css";
import { getIsDarkMode, sortArrayOfObjectsByKey } from "./utils";

interface TableProps {
    header: HeaderValue[];
    values: VariableValue[];
    sortHandler: (key: string) => void;
}

export interface HeaderValue {
    key: string;
    sortable: boolean;
}

export interface VariableValue {
    name: string;
    type: string;
    value: string;
}

export interface VariableViewProps {
    getVariableValues: () => Promise<VariableValue[]>;
    container: HTMLElement;
}

export const UPDATE_EVENT = "UPDATE_VIEW";

export const Table = ({ header, values, sortHandler }: TableProps): JSX.Element => {
    const tableContentValues = values;
    const getValue = (element: { [x: string]: any }, key: string | number) => element[key] ? element[key] : "";

    const renderHeader = () => {
        return header.map(({ key, sortable }) => {
            return (
                <th key={key} data-key={key}>
                    {key.toUpperCase()}
                    {sortable && (
                        <i
                            className="sort-by"
                            onClick={() => sortHandler(key)}
                        />
                    )}
                </th>
            );
        });
    };

    const renderBody = () => {
        let body: JSX.Element[] = [];
        for (let index = 0; index < tableContentValues.length; index++) {
            body.push(
                <tr key={tableContentValues[index].name}>
                    {header.map(({ key }) => {
                        return (
                            <td
                                className="table-data"
                                data-key={key}
                                key={`${key}_${index}`}
                            >
                                <span className="actual-value">
                                    {getValue(tableContentValues[index], key)}
                                </span>
                                <span className="tooltip-text">
                                    {getValue(tableContentValues[index], key)}
                                </span>
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

export const VariableView = ({ getVariableValues, container }: VariableViewProps): JSX.Element => {
    const darkMode = getIsDarkMode();
    const header = [
        { key: "name", sortable: true },
        { key: "type", sortable: false },
        { key: "value", sortable: false },
    ];
    const message = "No variables defined";
    const initialTableValues = {
        name: message,
        type: "",
        value: "",
    };
    const [tableValues, setTableValues] = useState([initialTableValues]);
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        isAscending: true,
    });

    const sortVals = (values: VariableValue[]) => {
        return sortArrayOfObjectsByKey(
            values,
            sortConfig.key,
            sortConfig.isAscending
        );
    };

    const updateVals = () => {
        getVariableValues().then((vals) => {
            if (!vals.length) {
                return setTableValues([initialTableValues]);
            }
            return setTableValues(sortVals(vals));
        });
    };

    useEffect(() => {
        updateVals();
        container.addEventListener(UPDATE_EVENT, updateVals);

        return () => {
            container.removeEventListener(UPDATE_EVENT, updateVals);
        };
    }, []);

    useEffect(() => {
        setTableValues(sortVals(tableValues));
    }, [sortConfig]);

    const updateSortConfig = (key: string) => {
        key === sortConfig.key
            ? // same key -> change ascending order
              setSortConfig({
                  ...sortConfig,
                  isAscending: !sortConfig.isAscending,
              })
            : // new key -> change key and make ascending
              setSortConfig({ key: key, isAscending: true });
    };

    return (
        <div
            id="variables-view"
            className={`variables-view ${darkMode ? "dark" : "light"}`}
        >
            <Table
                header={header}
                values={tableValues}
                sortHandler={updateSortConfig}
            />
        </div>
    );
};
