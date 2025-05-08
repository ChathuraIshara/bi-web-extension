/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface ValidateBreakpointsRequest {
    filePath: string;
    breakpoints: BreakpointPosition[];
}

export interface BreakpointPosition {
    line: number;
    column?: number;
}

export interface BreakpointValidity {
    line: number;
    valid: boolean;
    reason?: string;
    column?: number;
}

export interface ValidateBreakpointsResponse {
    breakpointValidity: BreakpointValidity[];
}

export interface GetBreakpointInfoRequest {
    filePath: string;
    breakpoints: BreakpointPosition[];
}

export interface GetBreakpointInfoResponse {
    breakpointInfo: BreakpointInfo[];
}

export interface AddBreakpointToSourceRequest {
    filePath: string;
    breakpoint: BreakpointPosition;
}

export interface AddBreakpointToSourceResponse {
    isBreakpointValid: boolean;
}

export interface GetBreakpointsRequest {
    filePath: string;
}

export interface GetBreakpointsResponse {
    breakpoints: BreakpointPosition[];
    activeBreakpoint: BreakpointPosition;
}

export interface StepOverBreakpointRequest {
    filePath: string;
    breakpoint: BreakpointPosition;
}

export interface StepOverBreakpointResponse {
    stepOverBreakpoints: BreakpointPosition[];
}

export interface RemoveBreakpointFromSourceRequest {
    filePath: string;
    breakpoint: BreakpointPosition;
}

export interface BreakpointInfo {
    sequence?: SequenceBreakpoint;
    template?: TemplateBreakpoint;
    command?: string;
    "command-argument"?: string;
    "mediation-component": string;
}

export interface SequenceBreakpoint {
    api?: ApiBreakpoint;
    proxy?: ProxyBreakpoint;
    inbound?: InboundEndpointBreakpoint;
    "sequence-type": string;
    "sequence-key": string;
    "mediator-position": string;
}

export interface ApiBreakpoint {
    "api-key": string;
    "resource": {
        "method": string;
        "uri-template": string;
        "url-mapping": string;
    };
    "sequence-type": string;
    "mediator-position": string;
}

export interface ProxyBreakpoint {
    "proxy-key": string;
    "sequence-type": string;
    "mediator-position": string;
}

export interface InboundEndpointBreakpoint {
    "inbound-key": string;
    "sequence-type": string;
    "mediator-position": string;
}

export interface TemplateBreakpoint {
    "template-key": string;
    "mediator-position": string;
}
