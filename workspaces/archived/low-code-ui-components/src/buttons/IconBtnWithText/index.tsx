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

import { IconButton } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from "classnames";

import { useStyles } from "../style";

export interface IconBtnWithTextProps {
    children?: string;
    onClick: (param?: any) => void,
    text?: string;
    variant?: string;
    iconClassName?: string;
    role?: string;
    disableRipple?: boolean;
    disableFocusRipple?: boolean;
    startIcon?: JSX.Element;
    fullWidth?: boolean;
    disabled?: boolean;
    size?: any;
    icon?: JSX.Element;
    className?: string;
}

export function IconBtnWithText(props: IconBtnWithTextProps) {
    const classes = useStyles();
    const { text, startIcon, onClick, fullWidth, disabled, size, iconClassName, icon, className } = props;
    return (
        <Button
            onClick={onClick}
            variant="contained"
            classes={{
                root: classNames(classes.iconBtn, className),
                disabled: classes.iconBtnDisable
            }}
            role="button"
            startIcon={startIcon}
            disableRipple={true}
            disableFocusRipple={true}
            fullWidth={fullWidth}
            disabled={disabled}
        >
            <IconButton
                className={iconClassName ? iconClassName : classes.iconBtnIcon}
                role="button"
                size={size}
                disabled={disabled}
            >{icon}
            </IconButton>
            {text ? (<Typography variant="h5">{text}</Typography>) : null}
        </Button>
    );
}
