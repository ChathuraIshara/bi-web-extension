/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FormCheckBox, Dropdown, RadioButtonGroup, TextField } from '@wso2-enterprise/ui-toolkit';
import { useFormContext } from "react-hook-form";

export const getParameterName = (id: string) => {
    return id.split(".").map((word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export const getParamId = (id: string) => {
    return `dataSourceConfigParameters.${id.split('.').join('-')}`;
}

interface Parameters {
    [key: string]: {
        message: string;
    };
}

const ParamField = ({ field, id }: any) => {
    const { register, control, formState: { errors } } = useFormContext();
    const { name, type, items } = field;

    const renderProps = (id: string) => {
        const fieldName = getParamId(id);
        return {
            id: fieldName,
            ...register(fieldName),
            errorMsg: errors.dataSourceConfigParameters && ((errors.dataSourceConfigParameters as Parameters)[id.split('.').join('-')]?.message?.toString())
        }
    };

    return (
        <div>
            {type === "text" ? (
                <TextField
                    required={field.validate?.required}
                    label={name ?? getParameterName(id)}
                    {...renderProps(id)}
                />
            ) : type === "checkbox" ? (
                <FormCheckBox
                    name={getParamId(id)}
                    label={name}
                    control={control}
                />
            ) : type === "dropdown" ? (
                <Dropdown
                    required={field.validate?.required}
                    label={name}
                    items={items}
                    {...renderProps(id)}
                />
            ) : type === "radio" ? (
                <RadioButtonGroup
                    label={name}
                    options={items}
                    {...renderProps(id)}
                />
            ) : <></>}
        </div>
    );
};

export default ParamField;
