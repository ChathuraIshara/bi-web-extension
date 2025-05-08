/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { InputWrapper, LabelWrapper, useStyles } from "../../../../../style";
import { TextField, Typography } from "@wso2-enterprise/ui-toolkit";
import { getTooltipIconComponent } from "../../../Utils";
import styled from "@emotion/styled";

interface FormTextInputProps {
    validate?: (value: any) => boolean;
    optional?: boolean;
    disableValidation?: boolean;
    inputProps?: any;
    clearInput?: boolean;
    startAdornment?: string;
    tooltipTitle?: string;
    focused?: boolean;
    disabled?: boolean;
    secret?: boolean;
    isErrored?: boolean;
    readonly?: boolean;
}

interface FormElementProps<T = {}> {
    index?: number;
    customProps?: T;
    onChange?: (event: any) => void;
    onBlur?: (event: any) => void;
    defaultValue?: any;
    label?: string;
    placeholder?: string;
    errorMessage?: string;
    dataTestId?: string;
    disabled?: boolean;
}

export function FormTextInput(props: FormElementProps<FormTextInputProps>) {
    const {
        index,
        customProps,
        onChange,
        onBlur,
        defaultValue,
        label,
        placeholder,
        errorMessage,
        dataTestId,
        disabled,
    } = props;
    const defaultText: string = defaultValue ? defaultValue : "";
    const textLabel = label ? label : "";

    const [inputValue, setInputValue] = useState(defaultText);

    if (customProps?.clearInput) {
        // setting the prop to false to avoid render loop
        customProps.clearInput = false;
        setInputValue("");
    }

    const classes = useStyles();

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
            checkValidity =
                customProps?.validate !== undefined &&
                ((customProps && customProps?.disableValidation !== undefined && !customProps?.disableValidation) ||
                    (customProps && customProps?.disableValidation === undefined))
                    ? customProps?.validate(defaultValue)
                    : true;
        }
        setIsInvalid(!checkValidity);
        setInputValue(defaultValue ? defaultValue : "");
    }, [defaultValue, customProps?.isErrored]);

    const handleOnChange = (value: string) => {
        if (onChange) {
            onChange(value);
        }

        if (
            customProps?.validate &&
            ((customProps && customProps.disableValidation !== undefined && !customProps.disableValidation) ||
                (customProps && customProps.disableValidation === undefined))
        ) {
            setIsInvalid(!customProps.validate(value));
        }
        setInputValue(value);
    };

    const handleOnBlur = (event: any) => {
        if (onBlur) {
            onBlur(event);
        }
    };

    return (
        <FormTextInputContainer>
            {textLabel !== "" ? (
                customProps && customProps.optional ? (
                    <InputWrapper>
                        <LabelWrapper>
                            <Typography variant="body3" className={classes.inputLabelForRequired}>
                                {textLabel}
                            </Typography>
                            <Typography variant="body3" className={classes.optionalLabel}>
                                <FormattedMessage
                                    id="lowcode.develop.elements.textField.formTextInput.optional.label"
                                    defaultMessage="Optional"
                                />
                            </Typography>
                        </LabelWrapper>
                        {customProps?.tooltipTitle && getTooltipIconComponent(customProps.tooltipTitle)}
                    </InputWrapper>
                ) : (
                    <InputWrapper>
                        <LabelWrapper>
                            <Typography variant="body3" className={classes.inputLabelForRequired}>
                                {textLabel}
                            </Typography>
                            <Typography variant="body3" className={classes.starLabelForRequired}>
                                *
                            </Typography>
                        </LabelWrapper>
                        {customProps?.tooltipTitle && getTooltipIconComponent(customProps.tooltipTitle)}
                    </InputWrapper>
                )
            ) : null}
            {customProps.readonly ? (
                <Typography variant="body3" className={classes.readOnlyEditor}>
                    {inputValue}
                </Typography>
            ) : (
                <TextField
                    size={80}
                    data-testid={dataTestId}
                    key={index}
                    placeholder={placeholder}
                    onTextChange={handleOnChange}
                    onBlur={handleOnBlur}
                    value={inputValue}
                    autoFocus={customProps?.focused}
                    disabled={disabled}
                    type={customProps?.secret ? "password" : "text"}
                    errorMsg={isInvalid ? errorMsg : ""}
                    inputProps={{
                        startAdornment: customProps?.startAdornment ? (
                            <Typography variant="body1">{customProps.startAdornment}</Typography>
                        ) : undefined,
                    }}
                />
            )}
        </FormTextInputContainer>
    );
}

const FormTextInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;
