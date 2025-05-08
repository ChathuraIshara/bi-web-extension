/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NotificationType } from "vscode-messenger-common";

export interface StateChangeEvent {
    state: string;
    theme: string;
    outputData?: string;
    errorMessage?: string;
}

export interface StateMachineContext {
    xRequestId?: string;
    convType?: string;
    inputData?: string;
    outputData?: string;
    error?: string;
    filePath?: string;
}

export interface SetInputDataEvent {
    type: 'SET_INPUT_DATA';
    inputData: string;
    convType: string;
    filePath: string;
}   

export const stateChanged: NotificationType<StateChangeEvent> = { method: "stateChanged" };
