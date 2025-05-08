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
    AddBreakpointToSourceResponse,
    GetBreakpointInfoRequest,
    GetBreakpointInfoResponse,
    GetBreakpointsRequest,
    GetBreakpointsResponse,
    MiDebuggerAPI,
    RemoveBreakpointFromSourceRequest,
    StepOverBreakpointRequest,
    StepOverBreakpointResponse,
    ValidateBreakpointsRequest,
    ValidateBreakpointsResponse,
    addBreakpointToSource,
    getBreakpointInfo,
    getBreakpoints,
    getStepOverBreakpoint,
    removeBreakpointFromSource,
    validateBreakpoints
} from "@wso2-enterprise/mi-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class MiDebuggerRpcClient implements MiDebuggerAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    validateBreakpoints(params: ValidateBreakpointsRequest): Promise<ValidateBreakpointsResponse> {
        return this._messenger.sendRequest(validateBreakpoints, HOST_EXTENSION, params);
    }

    getBreakpointInfo(params: GetBreakpointInfoRequest): Promise<GetBreakpointInfoResponse> {
        return this._messenger.sendRequest(getBreakpointInfo, HOST_EXTENSION, params);
    }

    addBreakpointToSource(params: AddBreakpointToSourceRequest): Promise<AddBreakpointToSourceResponse> {
        return this._messenger.sendRequest(addBreakpointToSource, HOST_EXTENSION, params);
    }

    getBreakpoints(params: GetBreakpointsRequest): Promise<GetBreakpointsResponse> {
        return this._messenger.sendRequest(getBreakpoints, HOST_EXTENSION, params);
    }

    getStepOverBreakpoint(params: StepOverBreakpointRequest): Promise<StepOverBreakpointResponse> {
        return this._messenger.sendRequest(getStepOverBreakpoint, HOST_EXTENSION, params);
    }

    removeBreakpointFromSource(params: RemoveBreakpointFromSourceRequest): void {
        return this._messenger.sendNotification(removeBreakpointFromSource, HOST_EXTENSION, params);
    }
}
