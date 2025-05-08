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

import { FormControlLabel, FormHelperText, Radio, RadioGroup } from "@material-ui/core";
import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { useStyles as useFormStyles } from "../../../DynamicConnectorForm/style";
import { useStyles as useRadioControlStyles } from "../style";
import '../style.scss'

export interface RadioProps {
    validate?: (field: string, isInvalid: boolean) => void;
    collection?: string[];
    optional?: boolean;
    disabled?: boolean;
}

export function RadioControl(props: FormElementProps<RadioProps>) {
    const formClasses = useFormStyles();
    const radioControlClasses = useRadioControlStyles();
    const { customProps, onChange, label, defaultValue } = props;
    const none: string = "none";

    const firstValueInCollection = customProps && customProps.collection && customProps.collection.length > 0 ? customProps.collection[0] : "";
    let initialValue = "";

    if (defaultValue || defaultValue === "") {
        initialValue = defaultValue;
    } else if (customProps && customProps.optional) {
        initialValue = none;
    } else if (firstValueInCollection !== "") {
        initialValue = firstValueInCollection;
    }

    const [selectedValue, setSelectedValue] = useState(initialValue);

    React.useEffect(() => {
        setSelectedValue(initialValue);
    }, [initialValue]);

    const radioControls: React.ReactNode[] = [];
    if (customProps && customProps.collection) {
        customProps.collection.forEach((item, key) => {
            radioControls.push(
                <FormControlLabel
                    key={key}
                    value={item}
                    control={
                        (
                            <Radio
                                data-testid={item.toLocaleLowerCase()}
                                disabled={customProps?.disabled}
                                classes={{ root: radioControlClasses.radiobtn, checked: radioControlClasses.checked }}
                            />
                        )
                    }
                    label={item}
                />
            );
        });
    }

    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
        if (onChange) {
            onChange(event.target.value);
        }
    };

    return (
        <>
            {label ?
                (customProps && customProps.optional ?
                    (
                        <div className={formClasses.labelWrapper}>
                            <FormHelperText className={formClasses.inputLabelForRequired}>{label}</FormHelperText>
                            <FormHelperText className={formClasses.optionalLabel}><FormattedMessage id="lowcode.develop.elements.formRadioControl.optional.label" defaultMessage="Optional"/></FormHelperText>
                        </div>
                    ) : (
                        <div className={formClasses.labelWrapper}>
                            <FormHelperText className={formClasses.inputLabelForRequired}>{label}</FormHelperText>
                            <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
                        </div>
                    )
                ) : null
            }
            <RadioGroup aria-label={label} name={label} value={selectedValue} onChange={handleChange}>
                {radioControls}
                {customProps && customProps.optional && <FormControlLabel value={none} control={<Radio />} label="None" />}
            </RadioGroup>
        </>
    );
}
