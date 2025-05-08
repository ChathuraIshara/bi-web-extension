/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react'
import { FormattedMessage } from 'react-intl';

import {FormHelperText} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { TooltipIcon } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { format, parse } from 'date-fns';

import {useStyles as useFormStyles} from "../../DynamicConnectorForm/style";
import {useStyles as useTextInputStyles} from "../TextField/style";

import { useStyles } from "./styles";

export interface DateLabelPickerProps {
    onChange: (date: Date) => void,
    disabled?: boolean,
    optional?: boolean;
    tooltipTitle?: string;
}

export function DateLabelPicker(props: FormElementProps<DateLabelPickerProps>) {
    const classes = useStyles();
    const { customProps, label = "", model} = props;
    const formClasses = useFormStyles();
    const textFieldClasses = useTextInputStyles();
    const textLabel = label ? label : "";
    const defaultDatetime = parse(model.value, `'"'yyyy-MM-dd'T'HH:mm:ssxxx'"'`, new Date());
    const [date, setDate] = React.useState<string>(format(defaultDatetime, "yyyy-MM-dd'T'HH:mm"));

    const handleDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTime = new Date(event.target.value);
        setDate(format(updatedTime, "yyyy-MM-dd'T'HH:mm"));
        props.onChange(updatedTime);
    };

    return (
        <>
            {textLabel !== "" ?
                (customProps && customProps.optional ?
                        (
                            <div className={textFieldClasses.inputWrapper}>
                                <div className={textFieldClasses.inputWrapper}>
                                    <div className={textFieldClasses.labelWrapper}>
                                        <FormHelperText className={formClasses.inputLabelForRequired}>{textLabel}</FormHelperText>
                                        <FormHelperText className={formClasses.optionalLabel}><FormattedMessage id="lowcode.develop.elements.dateLabelPicker.optional" defaultMessage="Optional"/></FormHelperText>
                                    </div>

                                </div>
                                {customProps?.tooltipTitle &&
                                (
                                    <TooltipIcon title={customProps?.tooltipTitle} />
                                )
                                }
                            </div>
                        ) : (
                            <div className={textFieldClasses.inputWrapper}>
                                <div className={textFieldClasses.labelWrapper}>
                                    <FormHelperText className={formClasses.inputLabelForRequired}>{textLabel}</FormHelperText>
                                    <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
                                </div>
                                {customProps?.tooltipTitle &&
                                (<TooltipIcon title={customProps?.tooltipTitle} />)
                                }
                            </div>

                        )
                ) : null
            }
            <form className={classes.container} noValidate={true}>
                <TextField
                    disabled={props.disabled}
                    label=""
                    value={date}
                    type="datetime-local"
                    className={classes.dateTimeWrapper}
                    onChange={handleDate}
                    InputProps={{
                        disableUnderline: true,
                    }}
                />
            </form>
        </>
    );
}
