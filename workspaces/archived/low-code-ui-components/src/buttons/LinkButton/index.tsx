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

import { useStyles } from "../style";

export interface LinkButtonProps {
    children?: string;
    onClick: (param?: any) => void,
    text?: string;
    variant?: string;
    className?: string;
    role?: string;
    disableRipple?: boolean;
    disableFocusRipple?: boolean;
    startIcon?: JSX.Element;
    fullWidth?: boolean;
    disabled?: boolean;
}

export function LinkButton(props: LinkButtonProps) {
    const classes = useStyles();
    const {text, startIcon, onClick, fullWidth, disabled} = props;
    return (
        <Button
            onClick={onClick}
            variant="contained"
            classes={{
                root: classes.linkBtn
            }}
            role="button"
            startIcon={startIcon}
            disableRipple={true}
            disableFocusRipple={true}
            fullWidth={fullWidth}
            disabled={disabled}
        >
            {text ? (<Typography variant="body1">{text}</Typography>) : null}
        </Button>
    );
}
