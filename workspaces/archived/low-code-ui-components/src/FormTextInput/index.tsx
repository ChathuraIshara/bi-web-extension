/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { FormHelperText, InputAdornment, TextField as MuiTextField } from "@material-ui/core";
import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { connectorStyles as useFormStyles } from "../connectorStyle";
import { useStyles as useTextInputStyles } from "../formStyle";
import { TooltipIcon } from "../Tooltip";

interface FormTextInputProps {
    validate?: (value: any) => boolean;
    optional?: boolean;
    disableValidation?: boolean;
    inputProps?: any;
    clearInput?: boolean;
    startAdornment?: string;
    tooltipTitle?: string;
    focused?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    secret?: boolean;
    isErrored?: boolean;
}

export function FormTextInput(props: FormElementProps<FormTextInputProps>) {
    const {
        index,
        customProps,
        onChange,
        onKeyUp,
        onBlur,
        onClick,
        onFocus,
        defaultValue,
        label,
        placeholder,
        errorMessage,
        dataTestId,
        size = "medium",
        disabled
    } = props;
    const formClasses = useFormStyles();
    const textFieldClasses = useTextInputStyles();
    const defaultText: string = defaultValue ? defaultValue : "";
    const textLabel = label ? label : "";

    const [inputValue, setInputValue] = useState(defaultText);

    if (customProps?.clearInput) {
        // setting the prop to false to avoid render loop
        customProps.clearInput = false;
        setInputValue("");
    }

    // to render invalid variable
    const [isInvalid, setIsInvalid] = useState(customProps?.isErrored);
    const [errorMsg, setErrorMsg] = useState(errorMessage);

    useEffect(() => {
        setErrorMsg(errorMessage);
    }, [errorMessage]);

    useEffect(() => {
        setIsInvalid(customProps?.isErrored);
    }, [customProps?.isErrored]);

    useEffect(() => {
        let checkValidity: boolean = false;
        if (!customProps?.isErrored) {
            checkValidity = (customProps?.validate !== undefined && ((customProps &&
                customProps?.disableValidation !== undefined && !customProps?.disableValidation) ||
                (customProps && customProps?.disableValidation === undefined)))
                ? customProps?.validate(defaultValue)
                : true;
        }
        setIsInvalid(!checkValidity);
        setInputValue(defaultValue ? defaultValue : "");
    }, [defaultValue, customProps?.isErrored])

    const handleOnChange = (event: any) => {
        event.stopPropagation();
        if (onChange) {
            onChange(event.target.value);
        }

        if (customProps?.validate && ((customProps && customProps.disableValidation !== undefined
            && !customProps.disableValidation) || (customProps && customProps.disableValidation === undefined))) {
            setIsInvalid(!customProps.validate(event.target.value));
        }
        setInputValue(event.target.value);
    };

    const handleOnKeyUp = (event: any) => {
        event.preventDefault();
        if (onKeyUp) {
            onKeyUp(event);
        }
    };

    const handleOnFocus = (event: any) => {
        event.preventDefault();
        if (onFocus) {
            onFocus(event);
        }
    };

    const handleOnBlur = (event: any) => {
        if (onBlur) {
            onBlur(event);
        }
    };

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <>
            {textLabel !== "" ?
                (customProps && customProps.optional ?
                    (
                        <div className={textFieldClasses.inputWrapper}>
                            <div className={textFieldClasses.inputWrapper}>
                                <div className={textFieldClasses.labelWrapper}>
                                    <FormHelperText className={formClasses.inputLabelForRequired}>
                                        {textLabel}
                                    </FormHelperText>
                                    <FormHelperText className={formClasses.optionalLabel}>
                                        <FormattedMessage
                                            id="lowcode.develop.elements.textField.formTextInput.optional.label"
                                            defaultMessage="Optional"
                                        />
                                    </FormHelperText>
                                </div>

                            </div>
                            {customProps?.tooltipTitle &&
                                (
                                    <TooltipIcon title={customProps?.tooltipTitle} arrow={true} />
                                )
                            }
                        </div>
                    ) : (
                        <div className={textFieldClasses.inputWrapper}>
                            <div className={textFieldClasses.labelWrapper}>
                                <FormHelperText className={formClasses.inputLabelForRequired}>
                                    {textLabel}
                                </FormHelperText>
                                <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
                            </div>
                            {customProps?.tooltipTitle &&
                                (<TooltipIcon title={customProps?.tooltipTitle} arrow={true} />)
                            }
                        </div>

                    )
                ) : null
            }
            {customProps.readonly ? (
                <FormHelperText className={formClasses.readOnlyEditor}>
                    {inputValue}
                </FormHelperText>
            ) : (
                <MuiTextField
                    data-testid={dataTestId}
                    error={isInvalid}
                    key={index}
                    InputProps={{
                        disableUnderline: true,
                        // tslint:disable-next-line: jsx-curly-spacing
                        classes: {
                            root: textFieldClasses.textFeild,
                            error: textFieldClasses.errorField,
                        },
                        startAdornment: customProps?.startAdornment ?
                            <InputAdornment position="start">{customProps.startAdornment}</InputAdornment> : null
                    }}
                    placeholder={placeholder}
                    fullWidth={true}
                    size={size}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleOnChange}
                    onKeyUp={handleOnKeyUp}
                    onBlur={handleOnBlur}
                    onClick={handleOnClick}
                    onFocus={handleOnFocus}
                    value={inputValue}
                    helperText={isInvalid ? errorMsg : ""}
                    autoFocus={customProps?.focused}
                    disabled={disabled}
                    type={customProps?.secret ? "password" : "text"}
                />
            )}

        </>
    );
}


