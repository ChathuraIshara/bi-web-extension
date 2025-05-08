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

import { ReturnType } from "../../types";

import { useStyles } from './style';

interface ReturnTypeItemProps {
    returnType: ReturnType;
    onDelete?: (index: ReturnType) => void;
    onEdit?: (returnType: string) => void;
}

export function ReturnTypeItem(props: ReturnTypeItemProps) {
    const { returnType, onDelete } = props;
    const classes = useStyles();

    const segmentLabel = `${returnType.type} ${returnType.isOptional ? "?" : ""}`;
    const handleDelete = () => {
        onDelete(returnType);
    };
    return (
        <div className={classes.headerWrapper}>
            <div className={classes.headerLabel}>
                {returnType.type !== "" && segmentLabel}
                <ButtonWithIcon
                    onClick={handleDelete}
                    icon={<CloseRounded fontSize="small" />}
                    className={classes.iconBtn}
                />
            </div>
        </div>
    );
}
