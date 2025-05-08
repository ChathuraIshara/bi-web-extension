/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { ConstantConfigFormState } from ".";
export enum ConstantConfigFormActionTypes {
    SET_CONSTANT_NAME,
    SET_CONSTANT_VALUE,
    SET_CONSTANT_TYPE,
    TOGGLE_INCLUDE_TYPE,
    UPDATE_EXPRESSION_VALIDITY,
    TOGGLE_ACCESS_MODIFIER,
}

type ConstantConfigFormActions =
    { type: ConstantConfigFormActionTypes.SET_CONSTANT_NAME, payload: string }
    | { type: ConstantConfigFormActionTypes.SET_CONSTANT_VALUE, payload: string }
    | { type: ConstantConfigFormActionTypes.SET_CONSTANT_TYPE, payload: string }
    | { type: ConstantConfigFormActionTypes.TOGGLE_INCLUDE_TYPE }
    | { type: ConstantConfigFormActionTypes.UPDATE_EXPRESSION_VALIDITY, paylaod: boolean }
    | { type: ConstantConfigFormActionTypes.TOGGLE_ACCESS_MODIFIER };

export function constantConfigFormReducer(state: ConstantConfigFormState, action: ConstantConfigFormActions)
    : ConstantConfigFormState {

    switch (action.type) {
        case ConstantConfigFormActionTypes.SET_CONSTANT_NAME:
            return { ...state, constantName: action.payload }
        case ConstantConfigFormActionTypes.SET_CONSTANT_VALUE:
            return { ...state, constantValue: action.payload }
        case ConstantConfigFormActionTypes.SET_CONSTANT_TYPE:
            return { ...state, constantType: action.payload }
        case ConstantConfigFormActionTypes.TOGGLE_INCLUDE_TYPE:
            return { ...state, constantType: '', isTypeDefined: !state.isTypeDefined}
        case ConstantConfigFormActionTypes.UPDATE_EXPRESSION_VALIDITY:
            return { ...state, isExpressionValid: action.paylaod }
        case ConstantConfigFormActionTypes.TOGGLE_ACCESS_MODIFIER:
            return { ...state, isPublic: !state.isPublic }
        default:
            return state;
    }
}
