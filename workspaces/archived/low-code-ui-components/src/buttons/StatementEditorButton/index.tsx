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

import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";

import PrimarySwitchToggle from "../../PrimarySwitchToggle";

import { useStyles } from "./style";

export interface StatementEditorButtonProps {
    handleChange?: () => void,
    checked?: boolean;
    disabled?: boolean;
    onClick?: () => void,
}

export function StatementEditorButton(props: StatementEditorButtonProps) {
    const { handleChange, checked, disabled, onClick } = props;
    const classes = useStyles();

    return (
        <FormGroup >
            <FormControlLabel
                className={classes.expressionTitle}
                control={(
                    <PrimarySwitchToggle
                        onChange={handleChange}
                        checked={checked}
                        onClick={onClick}
                        disabled={disabled}
                        data-testid="statement-editor-toggle"
                    />
                )}
                label=""
            />
        </FormGroup>
    );
}
