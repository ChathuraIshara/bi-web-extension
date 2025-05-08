// tslint:disable: jsx-no-multiline-js
import * as React from "react";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from "classnames";

import { useStyles } from "../style";

export interface ButtonProps {
    children?: string;
    onClick?: () => void,
    text?: string;
    variant?: string;
    className?: string;
    role?: string;
    disableRipple?: boolean;
    disableFocusRipple?: boolean;
    startIcon?: JSX.Element;
    fullWidth?: boolean;
    disabled?: boolean;
    type?: "button" | "reset" | "submit";
    component?: "span" | "button";
    testId?: string;
}

export function GreyButton(props: ButtonProps) {
    const classes = useStyles();
    const {text, startIcon, onClick, fullWidth, disabled, className, type, component, testId} = props;
    return (
        <Button
            data-testid={testId}
            onClick={onClick}
            variant="contained"
            classes={{
                root: classNames(classes.greyBtn, classes.square),
                disabled: classes.greyBtnDisabled
            }}
            role="button"
            startIcon={startIcon}
            disableRipple={true}
            disableFocusRipple={true}
            fullWidth={fullWidth}
            disabled={disabled}
            className={className}
            type={type}
            component={component}
        >
            {text ? (<Typography variant="h5" className={startIcon ? classes.iconBtnText : classes.btnText}>{text}</Typography>) : null}
        </Button>
    );
}
