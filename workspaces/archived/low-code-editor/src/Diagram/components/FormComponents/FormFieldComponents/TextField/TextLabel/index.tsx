/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable:jsx-no-multiline-js
// tslint:disable: jsx-wrap-multiline
import React from "react";
import { FormattedMessage } from "react-intl";

import { FormHelperText, TextField } from "@material-ui/core";

import { useStyles as useFormStyles } from "../../../DynamicConnectorForm/style";

export interface TextLabelProps {
    required: boolean;
    textLabelId: string;
    defaultMessage?: string;
    label?: string;
}
export function TextLabel(props: TextLabelProps) {
    const formClasses = useFormStyles();

    const { textLabelId: labelID, defaultMessage, label, required } = props;

    const labelType = required ?
        (<FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>)
        : (<FormHelperText className={formClasses.optionalLabel}>Optional</FormHelperText>);

    return (
        <div className={formClasses.labelWrapper}>
            <FormHelperText className={formClasses.inputLabelForRequired}>
                {
                    label ?
                        label
                        : <FormattedMessage id={labelID} defaultMessage={defaultMessage} />
                }
            </FormHelperText>
            {labelType}
        </div>
    );
}
