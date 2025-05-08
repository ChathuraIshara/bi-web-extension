// tslint:disable: jsx-no-multiline-js
import * as React from "react";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from "classnames";

import { useStyles } from "../style";

export interface ButtonProps {
    children?: string;
    onClick?: (() => void) | ((e: any) => Promise<void>);
    text?: string;
    variant?: string;
    className?: string;
    role?: string;
    disableRipple?: boolean;
    disableFocusRipple?: boolean;
    startIcon?: JSX.Element;
    fullWidth?: boolean;
    disabled?: boolean;
    size?: "medium" | "large" | "small";
    type?: "button" | "reset" | "submit";
    rootClassName?: string;
    dataTestId?: string;
}

export function PrimaryButtonSquare(props: ButtonProps) {
    const classes = useStyles();
    const { text, startIcon, onClick, fullWidth, disabled, className, type, size = 'medium', rootClassName, dataTestId } = props;
    return (
        <Button
            data-testid={dataTestId}
            onClick={onClick}
            variant="contained"
            classes={{
                root: classNames(classes.primaryBtn, classes.square, rootClassName),
                disabled: classes.disabled
            }}
            size={size}
            role="button"
            startIcon={startIcon}
            disableRipple={true}
            disableFocusRipple={true}
            fullWidth={fullWidth}
            disabled={disabled}
            className={className}
            type={type}
        >
            {text ? (<Typography variant="h5" className={startIcon ? classes.iconBtnText : classes.btnText}>{text}</Typography>) : null}
        </Button>
    );
}
