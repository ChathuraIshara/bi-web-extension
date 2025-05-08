/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export const MI_COPILOT_BACKEND_URL = `/chat/copilot`;
export const MI_ARTIFACT_GENERATION_BACKEND_URL = `/chat/artifact-generation`;
export const MI_ARTIFACT_EDIT_BACKEND_URL = `/chat/artifact-editing`;
export const MI_SUGGESTIVE_QUESTIONS_INITIAL_BACKEND_URL = `/suggestions/initial`;
export const MI_SUGGESTIVE_QUESTIONS_BACKEND_URL = `/suggestions`;
export const MI_UNIT_TEST_GENERATION_BACKEND_URL = `/unit-test/generate`;

// MI Copilot Error Messages
export const COPILOT_ERROR_MESSAGES = {
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    TOKEN_COUNT_EXCEEDED: 'Token Count Exceeded',
    ERROR_422: "Something went wrong. Please clear the chat and try again.",
};

// MI Copilot maximum allowed file size
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // Default to 5MB

export const USER_INPUT_PLACEHOLDER_MESSAGE = "Ask MI Copilot";

export const PROJECT_RUNTIME_VERSION_THRESHOLD = "4.4.0";

export const VALID_FILE_TYPES = {
    files: ["text/plain", "application/json", "application/x-yaml", "application/xml", "application/pdf", "text/xml"],
    images: ["image/jpeg", "image/png", "image/gif", "image/svg+xml"],
};
