/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */

import { isIcpEnabled, addICP, ICPEnabledRequest, disableICP } from "@wso2-enterprise/ballerina-core";
import { Messenger } from "vscode-messenger";
import { ICPServiceRpcManager } from "./rpc-manager";

export function registerIcpServiceRpcHandlers(messenger: Messenger) {
    const rpcManger = new ICPServiceRpcManager();
    messenger.onRequest(isIcpEnabled, (args: ICPEnabledRequest) => rpcManger.isIcpEnabled(args));
    messenger.onRequest(addICP, (args: ICPEnabledRequest) => rpcManger.addICP(args));
    messenger.onRequest(disableICP, (args: ICPEnabledRequest) => rpcManger.disableICP(args));
}
