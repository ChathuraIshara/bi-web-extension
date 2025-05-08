/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { useStyles } from "../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../LowCodeExpressionEditor";

interface XMLProps {
    validate?: (field: string, isInvalid: boolean) => void;
}

export function XML(props: FormElementProps<XMLProps>) {
    const { model, customProps, onChange, defaultValue } = props;
    const classes = useStyles();
    if (model?.name === undefined) {
        model.name = "xml"
    }

    const validateExpression = (fieldName: string, isInvalid: boolean) => {
        customProps?.validate(fieldName, isInvalid)
    }

    const onPropertyChange = (value: string) => {
        model.value = value
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <div className={classes.arraySubWrapper}>
            <LowCodeExpressionEditor
                model={model}
                customProps={{
                    validate: validateExpression,
                    statementType: model.typeName
                }}
                defaultValue={model.value}
                onChange={onPropertyChange}
            />
        </div>
    );
}
