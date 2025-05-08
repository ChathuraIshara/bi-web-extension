/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { ReactNode, SyntheticEvent } from "react";

import { FormHelperText } from "@material-ui/core";
import TextField, { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps } from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useStyles } from "./style";

export interface AutocompleteProps {
    label?: string;
    placeholder?: string;
    itemList: any[];
    value?: any;
    getItemLabel?: (item: any) => string;
    renderItem?: (item: any) => ReactNode;
    onChange: (event: object, value: any, reason: string) => void;
    dataTestId?: string;
    handleDropDownOpen?: (event: React.SyntheticEvent) => void;
}

export function FormAutocomplete(props: AutocompleteProps) {
    const { label, placeholder, itemList, value, getItemLabel, renderItem, onChange, handleDropDownOpen, dataTestId } = props;
    const classes = useStyles();

    function renderInnerTextField(params: (JSX.IntrinsicAttributes & StandardTextFieldProps) | (JSX.IntrinsicAttributes & FilledTextFieldProps) | (JSX.IntrinsicAttributes & OutlinedTextFieldProps)) {
        return (
            <TextField
                {...params}
                placeholder={placeholder}
                variant="outlined"
                InputLabelProps={{
                    shrink: false
                }}
            />
        );
    }

    const preventDiagramScrolling = (e: SyntheticEvent) => {
        e.stopPropagation();
    }
    return (
        <div
            onWheel={preventDiagramScrolling}
        >
            {label ?
                (
                    <>
                        <FormHelperText className={classes.titleLabel}>{label}</FormHelperText>
                        <FormHelperText className={classes.titleLabelRequired}>*</FormHelperText>
                    </>
                ) : null
            }

            <Autocomplete
                data-testid={dataTestId}
                disablePortal={true}
                id="combo-box-demo"
                options={itemList}
                getOptionLabel={getItemLabel}
                renderOption={renderItem}
                classes={{
                    root: classes.root,
                    inputRoot: classes.inputRoot,
                    input: classes.input,
                }}
                value={value ? value : null}
                renderInput={renderInnerTextField}
                onChange={onChange}
                closeIcon={null}
                openOnFocus={true}
                autoComplete={true}
                autoHighlight={true}
                onOpen={handleDropDownOpen}
                onClose={handleDropDownOpen}
            />
        </div>
    );
}
