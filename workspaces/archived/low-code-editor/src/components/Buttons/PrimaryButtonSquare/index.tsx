// tslint:disable: jsx-no-multiline-js
import * as React from "react";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from "classnames";

import { useStyles } from "../style";

export interface ButtonProps {
    children?: string;
    onClick?: (() => void) | ((e: any) => Promise<void>) | ((e: any) => void);
    text?: string;
    variant?: string;
    className?: string;
    role?: string;
    disableRipple?: boolean;
    disableFocusRipple?: boolean;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    fullWidth?: boolean;
    disabled?: boolean;
    size?: "medium" | "large" | "small";
    type?: "button" | "reset" | "submit";
    rootClassName?: string;
    testId?: string;
    id?: string;
}

export function PrimaryButtonSquare(props: ButtonProps) {
    const classes = useStyles();
    const { text, startIcon, endIcon, onClick, fullWidth, disabled, className,
            type, size = 'medium', rootClassName, testId: testId, id } = props;
    return (
        <Button
            id={id}
            data-testid={testId}
            onClick={onClick}
            variant="contained"
            classes={{
                root: classNames(classes.primaryBtn, classes.square, size === "small" && classes.squareSmall, rootClassName),
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
            endIcon={endIcon}
        >
            {text ? (<Typography variant="h5" className={classNames(startIcon ? classes.iconBtnText : classes.btnText, size === "small" && classes.squareSmallText)}>{text}</Typography>) : null}
        </Button>
    );
}
