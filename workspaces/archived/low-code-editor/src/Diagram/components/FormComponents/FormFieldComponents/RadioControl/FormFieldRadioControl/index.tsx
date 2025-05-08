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

import { getCollectionForRadio } from "../../../../Portals/utils";
import { useStyles as useFormStyles } from "../../../DynamicConnectorForm/style";
import { useStyles as useRadioControlStyles } from "../style";
import '../style.scss'

interface FormFieldRadioProps {
    validate?: (field: string, isInvalid: boolean) => void;
}

export function FormFieldRadioControl(props: FormElementProps<FormFieldRadioProps>) {
    const formClasses = useFormStyles();
    const radioControlClasses = useRadioControlStyles();
    const { model, onChange, customProps } = props;
    const none: string = "none";
    const collection = getCollectionForRadio(model);
    const firstValueInCollection = collection && collection.length > 0 ? collection[0] : "";

    let initialValue = "";
    if (model && model.value) {
        initialValue = model.value;
    } else if (model && model.optional) {
        initialValue = none;
    } else if (firstValueInCollection !== "") {
        initialValue = firstValueInCollection;
    }

    const [selectedValue, setSelectedValue] = useState(initialValue);

    if (model) {
        model.value = initialValue === none ? undefined : initialValue;
    }

    customProps?.validate(model.name, model?.value === '');

    const radioControls: React.ReactNode[] = [];
    collection.forEach(item => {
        radioControls.push(
            <FormControlLabel
                value={item}
                control={<Radio classes={{ root: radioControlClasses.radiobtn, checked: radioControlClasses.checked }} />}
                label={item}
            />
        );
    });

    const handleChange = (event: any) => {
        if (model) {
            model.value = event.target.value === none ? undefined : event.target.value;
        }
        setSelectedValue(event.target.value);
        if (onChange) {
            onChange(event.target.value);
        }
    };

    const modelName = model && model.displayName ? model.displayName : model.name;

    return (
        <div>
            {model && model.optional ?
                (
                    <div className={formClasses.labelWrapper}>
                        <FormHelperText className={formClasses.inputLabelForRequired}>{modelName}</FormHelperText>
                        <FormHelperText className={formClasses.optionalLabel}><FormattedMessage id="lowcode.develop.elements.formFieldRadioControl.optional.label" defaultMessage="Optional"/></FormHelperText>
                    </div>
                ) : (
                    <div className={formClasses.labelWrapper}>
                        <FormHelperText className={formClasses.inputLabelForRequired}>{modelName}</FormHelperText>
                        <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
                    </div>
                )
            }
            <RadioGroup aria-label={model.name} name={model.name} value={selectedValue} onChange={handleChange}>
                {...radioControls}
                {model && model.optional && <FormControlLabel value={none} control={<Radio />} label="None" />}
            </RadioGroup>
        </div>
    );
}
