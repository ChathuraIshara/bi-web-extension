/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import * as React from "react";

import IconButton from '@material-ui/core/IconButton';

import { useStyles } from "../style";

export interface ButtonWithIconProps {
    children?: string;
    onClick: (param?: any) => void,
    className?: string;
    role?: string;
    icon: JSX.Element;
    size?: any;
    disabled?: boolean;
    dataTestId?: string
}

export function ButtonWithIcon(props: ButtonWithIconProps) {
    const classes = useStyles();
    const { icon, onClick, size, className, disabled, dataTestId } = props;
    return (
        <IconButton
            onClick={onClick}
            className={className}
            role="button"
            size={size}
            disabled={disabled}
            data-testid={dataTestId}
        >{icon}
        </IconButton>
    );
}

