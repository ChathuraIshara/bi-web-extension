/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { LineRange } from '@wso2-enterprise/ballerina-core';
import React, { createContext, FC, useContext } from 'react';
import { 
    Control,
    FieldValues, 
    UseFormWatch, 
    UseFormRegister, 
    UseFormSetValue, 
    UseFormUnregister, 
    UseFormSetError,
    UseFormClearErrors,
    FieldErrors,
    UseFormGetValues
} from 'react-hook-form';
import { FormExpressionEditorProps } from '../components/Form/types';

export interface FormContext {
    form: {
        control: Control<FieldValues, any>;
        getValues: UseFormGetValues<FieldValues>;
        setValue: UseFormSetValue<FieldValues>;
        watch: UseFormWatch<any>;
        register: UseFormRegister<FieldValues>;
        unregister: UseFormUnregister<FieldValues>;
        setError: UseFormSetError<FieldValues>;
        clearErrors: UseFormClearErrors<FieldValues>;
        formState: { isValidating: boolean; errors: FieldErrors<FieldValues> };
    };
    expressionEditor?: FormExpressionEditorProps;
    targetLineRange: LineRange;
    fileName: string;
}

const defaultState: any = {};
export const Context = createContext<FormContext>(defaultState);

export const Provider: FC<FormContext> = (props) => {
    const { children, ...restProps } = props;

    return <Context.Provider value={restProps}>{children}</Context.Provider>;
};

export const useFormContext = () => useContext(Context);
