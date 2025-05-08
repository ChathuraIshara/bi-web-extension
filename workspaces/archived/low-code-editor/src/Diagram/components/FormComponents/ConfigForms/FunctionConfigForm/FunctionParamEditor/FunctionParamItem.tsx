/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { CloseRounded } from "@material-ui/icons";
import { ButtonWithIcon } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { FunctionParam } from "../types";

import { useStyles } from './style';

interface FunctionParamItemProps {
    functionParam: FunctionParam;
    addInProgress: boolean;
    onDelete?: (functionParam: FunctionParam) => void;
    onEditClick?: (functionParam: FunctionParam) => void;
}

export function FunctionParamItem(props: FunctionParamItemProps) {
    const { functionParam, addInProgress, onDelete, onEditClick } = props;
    const classes = useStyles();

    const segmentLabel = functionParam.type + " " + functionParam.name;
    const handleDelete = () => {
        onDelete(functionParam);
    };
    const handleEdit = () => {
        onEditClick(functionParam);
    };
    return (
        <div className={classes.headerWrapper}>
            <div className={classes.headerLabel}>
                <div className={classes.headerLabelCursor} onClick={handleEdit}>
                    {segmentLabel}
                </div>
                <ButtonWithIcon
                    onClick={handleDelete}
                    icon={<CloseRounded fontSize="small" />}
                    className={classes.iconBtn}
                />
            </div>
        </div>
    );
}
