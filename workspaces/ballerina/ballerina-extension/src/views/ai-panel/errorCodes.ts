/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ErrorCode } from "@wso2-enterprise/ballerina-core";

export const NOT_LOGGED_IN: ErrorCode = {
    code: 1,
    message: "You need to be logged in to use WSO2 Copilot Features. Please login and try again."
};

export const TIMEOUT: ErrorCode = {
    code: 2,
    message: "Request timeout exceeded. Please try again."
};

export const PARSING_ERROR: ErrorCode = {
    code: 3,
    message: "There was an issue with your request. Please check the input and try again."
};

export const UNKNOWN_ERROR: ErrorCode = {
    code: 4,
    message: "An unknown error occurred while generating code. Try login again to copilot"
};

export const MODIFIYING_ERROR: ErrorCode = {
    code: 5,
    message: "Code generation failed due to insufficient mapping data. Please review the fields and try again."
};

export const USER_ABORTED: ErrorCode = {
    code: 6,
    message: "The user has aborted the process."
};

export const ENDPOINT_REMOVED: ErrorCode = {
    code: 7,
    message: "Ballerina plugin is outdated. Please update the Ballerina VSCode Plugin."
};

export const INVALID_PARAMETER_TYPE: ErrorCode = {
    code: 8,
    message: "AI data mapper only supports records as inputs and outputs."
};

export const INVALID_PARAMETER_TYPE_MULTIPLE_ARRAY: ErrorCode = {
    code: 9,
    message: "AI data mapper only supports mappings between single input and output arrays."
};

export const SERVER_ERROR: ErrorCode = {
    code: 10,
    message: "An error occurred on the server. Please try again later."
};

export const TOO_MANY_REQUESTS: ErrorCode = {
    code: 11,
    message: "Too many requests in a short period. Please review the fields and try again."
};

export const INVALID_RECORD_UNION_TYPE: ErrorCode = {
    code: 14,
    message: "AI data mapper does not support input or output as a union of records."
};
