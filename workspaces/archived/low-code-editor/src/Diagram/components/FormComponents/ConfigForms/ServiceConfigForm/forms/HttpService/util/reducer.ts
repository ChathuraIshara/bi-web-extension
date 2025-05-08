/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
export interface HTTPServiceConfigState {
    serviceBasePath: string;
    listenerConfig: ListenerConfigFormState,
    hasInvalidConfig: boolean
}

export interface TriggerServiceConfigState {
    triggerChannel: string;
    listenerConfig: ListenerConfigFormState,
    hasInvalidConfig: boolean
}

export interface ListenerConfigFormState {
    createNewListener: boolean;
    fromVar: boolean,
    listenerName: string,
    listenerPort: string,
}

export enum ServiceConfigActionTypes {
    SET_PATH,
    SET_LISTENER_NAME,
    SET_LISTENER_PORT,
    CREATE_NEW_LISTENER,
    SELECT_EXISTING_LISTENER,
    DEFINE_LISTENER_INLINE,
    UPDATE_INVALID_CONFIG_STATUS
}

export type ServiceConfigActions =
    { type: ServiceConfigActionTypes.SET_PATH, payload: string }
    | { type: ServiceConfigActionTypes.CREATE_NEW_LISTENER }
    | { type: ServiceConfigActionTypes.SET_LISTENER_NAME, payload: string }
    | { type: ServiceConfigActionTypes.SET_LISTENER_PORT, payload: string }
    | { type: ServiceConfigActionTypes.SELECT_EXISTING_LISTENER, payload: string }
    | { type: ServiceConfigActionTypes.DEFINE_LISTENER_INLINE, payload: boolean }
    | { type: ServiceConfigActionTypes.UPDATE_INVALID_CONFIG_STATUS, payload: boolean }


export function serviceConfigReducer(
    state: HTTPServiceConfigState, action: ServiceConfigActions): HTTPServiceConfigState {

    switch (action.type) {
        case ServiceConfigActionTypes.SET_PATH:
            return { ...state, serviceBasePath: action.payload };
        case ServiceConfigActionTypes.SET_LISTENER_NAME:
            return { ...state, listenerConfig: { ...state.listenerConfig, listenerName: action.payload } };
        case ServiceConfigActionTypes.SET_LISTENER_PORT:
            return { ...state, listenerConfig: { ...state.listenerConfig, listenerPort: action.payload } };
        case ServiceConfigActionTypes.CREATE_NEW_LISTENER:
            return {
                ...state,
                listenerConfig: {
                    ...state.listenerConfig,
                    createNewListener: true,
                    listenerName: '',
                    listenerPort: ''
                },
                hasInvalidConfig: true
            };
        case ServiceConfigActionTypes.SELECT_EXISTING_LISTENER:
            return {
                ...state,
                listenerConfig: {
                    ...state.listenerConfig,
                    createNewListener: false,
                    listenerName: action.payload,
                    listenerPort: ''
                }
            };
        case ServiceConfigActionTypes.DEFINE_LISTENER_INLINE:
            return {
                ...state,
                listenerConfig: { ...state.listenerConfig, fromVar: action.payload },
                hasInvalidConfig: true
            };
        case ServiceConfigActionTypes.UPDATE_INVALID_CONFIG_STATUS:
            return { ...state, hasInvalidConfig: action.payload };
        default:
            return state;
    }
}
