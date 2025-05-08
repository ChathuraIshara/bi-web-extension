/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ConfigurableFormState } from ".";

export enum ConfigurableFormActionTypes {
    UPDATE_ACCESS_MODIFIER,
    SET_VAR_TYPE,
    SET_VAR_NAME,
    SET_VAR_VALUE,
    SET_DEFAULT_INCLUDED,
    UPDATE_EXPRESSION_VALIDITY,
    RESET_VARIABLE_TYPE,
    SET_VAR_LABEL,
}

export type ModuleVarFormAction =
    { type: ConfigurableFormActionTypes.UPDATE_ACCESS_MODIFIER, payload: boolean }
    | { type: ConfigurableFormActionTypes.SET_VAR_TYPE, payload: string }
    | { type: ConfigurableFormActionTypes.SET_VAR_NAME, payload: string }
    | { type: ConfigurableFormActionTypes.SET_VAR_VALUE, payload: string }
    | { type: ConfigurableFormActionTypes.SET_VAR_LABEL, payload: string }
    | { type: ConfigurableFormActionTypes.UPDATE_EXPRESSION_VALIDITY, payload: boolean }
    | { type: ConfigurableFormActionTypes.SET_DEFAULT_INCLUDED, payload: boolean}
    | { type: ConfigurableFormActionTypes.RESET_VARIABLE_TYPE };

export function moduleVarFormReducer(state: ConfigurableFormState, action: ModuleVarFormAction): ConfigurableFormState {
    switch (action.type) {
        case ConfigurableFormActionTypes.UPDATE_ACCESS_MODIFIER:
            return { ...state, isPublic: action.payload };
        case ConfigurableFormActionTypes.SET_VAR_NAME:
            return { ...state, varName: action.payload };
        case ConfigurableFormActionTypes.SET_VAR_VALUE:
            return { ...state, varValue: action.payload };
        case ConfigurableFormActionTypes.SET_VAR_LABEL:
            return { ...state, label: action.payload };
        case ConfigurableFormActionTypes.SET_VAR_TYPE:
            return { ...state, varType: action.payload, varValue: '' };
        case ConfigurableFormActionTypes.UPDATE_EXPRESSION_VALIDITY:
            return { ...state, isExpressionValid: action.payload };
        case ConfigurableFormActionTypes.SET_DEFAULT_INCLUDED:
            return { ...state, hasDefaultValue: action.payload };
        case ConfigurableFormActionTypes.RESET_VARIABLE_TYPE:
            return { ...state, varType: '', varValue: '' };
    }
}
