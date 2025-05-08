/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import {
    AddBreakpointToSourceRequest,
    GetBreakpointInfoRequest,
    GetBreakpointsRequest,
    RemoveBreakpointFromSourceRequest,
    StepOverBreakpointRequest,
    ValidateBreakpointsRequest,
    addBreakpointToSource,
    getBreakpointInfo,
    getBreakpoints,
    getStepOverBreakpoint,
    removeBreakpointFromSource,
    validateBreakpoints
} from "@wso2-enterprise/mi-core";
import { Messenger } from "vscode-messenger";
import { MiDebuggerRpcManager } from "./rpc-manager";

export function registerMiDebuggerRpcHandlers(messenger: Messenger) {
    const rpcManger = new MiDebuggerRpcManager();
    messenger.onRequest(validateBreakpoints, (args: ValidateBreakpointsRequest) => rpcManger.validateBreakpoints(args));
    messenger.onRequest(getBreakpointInfo, (args: GetBreakpointInfoRequest) => rpcManger.getBreakpointInfo(args));
    messenger.onRequest(addBreakpointToSource, (args: AddBreakpointToSourceRequest) => rpcManger.addBreakpointToSource(args));
    messenger.onRequest(getBreakpoints, (args: GetBreakpointsRequest) => rpcManger.getBreakpoints(args));
    messenger.onRequest(getStepOverBreakpoint, (args: StepOverBreakpointRequest) => rpcManger.getStepOverBreakpoint(args));
    messenger.onNotification(removeBreakpointFromSource, (args: RemoveBreakpointFromSourceRequest) => rpcManger.removeBreakpointFromSource(args));
}
