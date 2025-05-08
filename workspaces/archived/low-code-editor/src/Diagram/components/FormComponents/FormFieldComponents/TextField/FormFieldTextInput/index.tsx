/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-empty jsx-curly-spacing
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { FormHelperText, TextField as MuiTextField } from "@material-ui/core";
import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { isValidTextInput, validateEmail } from "../../../../Portals/utils";
import { useStyles as useFormStyles } from "../../../DynamicConnectorForm/style";
import { useStyles as useTextInputStyles } from "../style";

export interface FormFieldTextInputProps {
    validate?: (field: string, isInvalid: boolean) => void;
    isEmail?: boolean;
}

export function FormFieldTextInput(props: FormElementProps<FormFieldTextInputProps>) {
    const { model, index, customProps, onChange } = props;
    const formClasses = useFormStyles();
    const textFieldClasses = useTextInputStyles();
    const defaultText: string = model && model.value ? model.value : "";
    const textLabel = model && model.displayName ? model.displayName : model.name;

    const [inputValue, setInputValue] = useState(defaultText);

    if ((inputValue !== '') && (model.value !== undefined)) {
        model.value = inputValue;
    }

    let valueIsEmpty = !model.optional && (model.value === undefined || model.value === "");
    let emailCheck = customProps?.isEmail ? validateEmail(model.value) : true;
    let valueIsInvalid: boolean = model.value !== undefined && model.value !== "" && (!emailCheck || !isValidTextInput(model.value, model.typeName));

    if (model && model.value === undefined) {
        model.value = "";
    }

    const [isInvalid, setIsInvalid] = useState(valueIsInvalid);

    if ((customProps?.validate !== undefined) &&
        ((model.value !== undefined && model.value !== "") || (model.value === ""))) {
        customProps?.validate(model.name, (valueIsEmpty || valueIsInvalid));
    }

    const handleOnChange = (event: any) => {
        if (model) {
            model.value = event.target.value;
        }
        if (onChange) {
            onChange(event.target.value);
        }
        valueIsEmpty = !model.optional && (model.value === undefined || model.value === "");
        emailCheck = customProps?.isEmail ? validateEmail(model.value) : true;
        valueIsInvalid = model.value !== undefined && model.value !== "" && (!emailCheck || !isValidTextInput(model.value, model.typeName));
        setIsInvalid(valueIsInvalid);
        if (customProps?.validate) {
            customProps.validate(model.name, (valueIsEmpty || valueIsInvalid));
        }
        setInputValue(event.target.value);
    };

    let placeholderText: string;
    if (model.description) {
        placeholderText = model.description;
    } else if ((model.name !== undefined) && (model.name !== "")) {
        placeholderText = "Enter " + model.name;
    } else {
        placeholderText = "Enter value";
    }

    React.useEffect(() => {
        setInputValue(defaultText);
    }, [defaultText]);

    return (
        <>
            {textLabel ?
                (model && model.optional ?
                    (
                        <div className={formClasses.labelWrapper}>
                            <FormHelperText className={formClasses.inputLabelForRequired}>{textLabel}</FormHelperText>
                            <FormHelperText className={formClasses.optionalLabel}><FormattedMessage id="lowcode.develop.elements.textField.formFieldTextInput.optional.label" defaultMessage="Optional"/></FormHelperText>
                        </div>
                    ) : (
                        <div className={formClasses.labelWrapper}>
                            <FormHelperText className={formClasses.inputLabelForRequired}>{textLabel}</FormHelperText>
                            <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
                        </div>
                    )
                ) : null
            }
            <MuiTextField
                error={isInvalid}
                key={index}
                InputProps={{
                    disableUnderline: true,
                    classes: {
                        root: textFieldClasses.textFeild,
                        error: textFieldClasses.errorField,
                    }
                }}
                placeholder={placeholderText}
                fullWidth={true}
                size='medium'
                margin="normal"
                InputLabelProps={{ shrink: true }}
                onChange={handleOnChange}
                value={inputValue}
                helperText={isInvalid ? "Invalid input" : ""}
            />
        </>
    );
}
