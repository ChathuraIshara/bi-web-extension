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
import { ValidateBreakpointsRequest, ValidateBreakpointsResponse, GetBreakpointInfoRequest, GetBreakpointInfoResponse, AddBreakpointToSourceRequest, AddBreakpointToSourceResponse, GetBreakpointsRequest, GetBreakpointsResponse, StepOverBreakpointResponse, StepOverBreakpointRequest, RemoveBreakpointFromSourceRequest } from "./types";
import { RequestType, NotificationType } from "vscode-messenger-common";

const _preFix = "mi-debugger";
export const validateBreakpoints: RequestType<ValidateBreakpointsRequest, ValidateBreakpointsResponse> = { method: `${_preFix}/validateBreakpoints` };
export const getBreakpointInfo: RequestType<GetBreakpointInfoRequest, GetBreakpointInfoResponse> = { method: `${_preFix}/getBreakpointInfo` };
export const addBreakpointToSource: RequestType<AddBreakpointToSourceRequest, AddBreakpointToSourceResponse> = { method: `${_preFix}/addBreakpointToSource` };
export const getBreakpoints: RequestType<GetBreakpointsRequest, GetBreakpointsResponse> = { method: `${_preFix}/getBreakpoints` };
export const getStepOverBreakpoint: RequestType<StepOverBreakpointRequest, StepOverBreakpointResponse> = { method: `${_preFix}/getStepOverBreakpoint` };
export const removeBreakpointFromSource: NotificationType<RemoveBreakpointFromSourceRequest> = { method: `${_preFix}/removeBreakpointFromSource` };
