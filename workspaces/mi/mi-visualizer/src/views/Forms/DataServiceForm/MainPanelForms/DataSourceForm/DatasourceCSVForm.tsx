/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { TextField, RadioButtonGroup } from "@wso2-enterprise/ui-toolkit";

export interface DataSourceCSVFormProps {
    renderProps: any;
}

export function DataSourceCSVForm(props: DataSourceCSVFormProps) {

    return (
        <>
            <TextField
                label="CSV File Location"
                required
                size={100}
                {...props.renderProps('csv.csv_datasource')}
            />
            <TextField
                label="Column Separator"
                size={100}
                {...props.renderProps('csv.csv_columnseperator')}
            />
            <TextField
                label="Start Reading from Row"
                size={100}
                {...props.renderProps('csv.csv_startingrow')}
            />
            <TextField
                label="Maximum Number of Rows to Read"
                size={100}
                {...props.renderProps('csv.csv_maxrowcount')}
            />
            <RadioButtonGroup
                label="Contains Column Header Row"
                required
                options={[{ content: "True", value: "true" }, {content: "False", value: "false"}]}
                {...props.renderProps('csv.csv_hasheader')}
            />
            <TextField
                label="Header Row"
                size={100}
                {...props.renderProps('csv.csv_headerrow')}
            />
        </>
    );
}
