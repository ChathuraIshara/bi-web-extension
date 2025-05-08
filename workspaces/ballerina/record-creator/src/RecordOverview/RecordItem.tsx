/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";
import { RecordItemModel } from "../types";
import { CheckBoxGroup } from "../components/FormComponents/FormFieldComponents/CheckBox";
import { Button, Codicon } from "@wso2-enterprise/ui-toolkit";
import { useStyles } from "../style";

interface ParamItemProps {
    record: RecordItemModel;
    onEditClick: (param: string) => void;
    handleOnCheck: () => void;
}

export function RecordItem(props: ParamItemProps) {
    const classes = useStyles();
    const { record, onEditClick, handleOnCheck } = props;

    const handleEdit = () => {
        onEditClick(record.name);
    };

    const handleCheckboxClick = (list: string[]) => {
        record.checked = list.length > 0;
        handleOnCheck();
    };

    return (
        <div className={classes.headerWrapper} data-testid={`${record.name}-item`}>
            <div className={classes.contentSection}>
                <CheckBoxGroup
                    values={[record.name]}
                    defaultValues={record.checked ? [record.name] : []}
                    onChange={handleCheckboxClick}
                />
            </div>
            <div className={classes.iconSection}>
                <Button appearance="icon" onClick={handleEdit} sx={{ height: "14px", width: "14px", marginRight: "5px" }}>
                    <Codicon name="edit" />
                </Button>
            </div>
        </div>
    );
}
