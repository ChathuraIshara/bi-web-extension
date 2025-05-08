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

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from "classnames";

import { useStyles } from "../style";

export interface PrimaryButtonProps {
    children?: string;
    onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    text?: string;
    variant?: string;
    className?: string;
    role?: string;
    disableRipple?: boolean;
    disableFocusRipple?: boolean;
    startIcon?: JSX.Element;
    fullWidth?: boolean;
    disabled?: boolean;
    dataTestId?: string;
}

export function PrimaryButton(props: PrimaryButtonProps) {
    const classes = useStyles();
    const {text, startIcon, onClick, fullWidth, disabled, className, dataTestId} = props;
    return (
        <Button
            data-testid={dataTestId}
            onClick={onClick}
            variant="contained"
            classes={{
                root: classNames(classes.primaryBtn, classes.square),
                disabled: classes.disabled
            }}
            role="button"
            startIcon={startIcon}
            disableRipple={true}
            disableFocusRipple={true}
            fullWidth={fullWidth}
            disabled={disabled}
            className={className}
        >
            {text ? (<Typography variant="h5" className={classes.btnText}>{text}</Typography>) : null}
        </Button>
    );
}
