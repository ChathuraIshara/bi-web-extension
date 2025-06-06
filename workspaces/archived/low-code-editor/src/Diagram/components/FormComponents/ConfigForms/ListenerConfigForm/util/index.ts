/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { ListenerConfig } from "./types";

export function isListenerConfigValid(config: ListenerConfig): boolean {
    const { listenerName, listenerPort, isExpressionValid: isListenerNameValid } = config;

    return listenerPort.length > 0 && listenerName.length > 0 && isListenerNameValid;
}
