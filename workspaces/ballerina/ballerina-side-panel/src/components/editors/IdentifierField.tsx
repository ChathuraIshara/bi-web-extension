/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TextField } from "@wso2-enterprise/ui-toolkit";
import React, { useState, useCallback } from "react";
import { capitalize, debounce } from "lodash";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { useFormContext } from "../../context";
import { getPropertyFromFormField } from "./utils";
import { FormField } from "../Form/types";
export interface IdentifierFieldProps {
    field: FormField;
    handleOnFieldFocus?: (key: string) => void;
    autoFocus?: boolean;
}

export function IdentifierField(props: IdentifierFieldProps) {
    const { field, handleOnFieldFocus, autoFocus } = props;
    const { rpcClient } = useRpcContext();
    const { expressionEditor, form } = useFormContext();
    const { getExpressionEditorDiagnostics } = expressionEditor;
    const { watch, formState, register } = form;
    const { errors } = formState;

    const validateIdentifierName = useCallback(debounce(async (value: string) => {
        const fieldValue = watch(field.key);

        const response = await getExpressionEditorDiagnostics(!field.optional || fieldValue !== '',
            fieldValue,
            field.key,
            getPropertyFromFormField(field));
    }, 250), [rpcClient, field]);

    const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        validateIdentifierName(e.target.value);
    }

    const handleOnFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        validateIdentifierName(e.target.value);
        handleOnFieldFocus?.(field.key);
    }

    const registerField = register(field.key, { required: !field.optional && !field.placeholder, value: field.value })
    const { onChange } = registerField;


    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        validateIdentifierName(e.target.value);
    }

    return (
        <TextField
            id={field.key}
            label={capitalize(field.label)}
            {...registerField}
            onChange={(e) => handleOnChange(e)}
            required={!field.optional}
            description={field.documentation}
            placeholder={field.placeholder}
            readOnly={!field.editable}
            errorMsg={errors[field.key]?.message.toString()}
            onBlur={(e) => handleOnBlur(e)}
            onFocus={(e) => handleOnFocus(e)}
            autoFocus={autoFocus}
            sx={{ width: "100%" }}
        />
    );
}
