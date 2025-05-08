/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { DeleteButton, ParamEditButton } from '@wso2-enterprise/ballerina-low-code-edtior-commons';

import { PARAM_TYPES } from "./ParamEditor";
import { ParamIcons } from "./ParamIcon";
import { useStyles } from './style';

export interface ParameterConfig {
    id: number;
    name: string;
    type?: string;
    option?: PARAM_TYPES;
    defaultValue?: string;
}

interface ParamItemProps {
    param: ParameterConfig;
    readonly: boolean;
    onDelete?: (param: ParameterConfig) => void;
    onEditClick?: (param: ParameterConfig) => void;
}

export function ParamItem(props: ParamItemProps) {
    const { param, readonly, onDelete, onEditClick } = props;
    const classes = useStyles();

    const label = param?.type ? `${param.type} ${param.name}${param.defaultValue ? ` = ${param.defaultValue}` : ""}`
        : `${param.name}`;
    const handleDelete = () => {
        onDelete(param);
    };
    const handleEdit = () => {
        if (!readonly) {
            onEditClick(param);
        }
    };

    const icon = (<ParamIcons type={param?.option} />);

    return (
        <div className={classes.headerWrapper} data-testid={`${label}-item`}>
            <div className={classes.headerLabel}>
                <div className={classes.iconSection} onClick={handleEdit}>
                    {icon && (
                        <div className={classes.iconWrapper}>
                            {icon}
                        </div>
                    )}
                    <div className={classes.iconTextWrapper}>
                        {param?.option?.toUpperCase()}
                    </div>
                </div>
                <div className={classes.contentSection}>
                    <div data-test-id={`${label}-param`} className={readonly ? classes.disabledHeaderLabel : classes.enabledHeaderLabel} onClick={handleEdit}>
                        {label}
                    </div>
                    {!readonly && (
                        <>
                            <div className={classes.contentIconWrapper}>
                                <ParamEditButton onClick={handleEdit} />
                            </div>
                            <div className={classes.deleteButtonWrapper}>
                                <DeleteButton onClick={handleDelete} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
