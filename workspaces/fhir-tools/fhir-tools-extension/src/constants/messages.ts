/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export const ERROR_MESSAGES = {
    NO_ACTIVE_DOCUMENT: 'No active document',
    INVALID_COMMAND_TYPE: 'Invalid command type',
    API_KEY_NOT_FOUND: 'API key not found',
    HL7V2_SERVICE_NOT_ACTIVE: 'HL7v2 to FHIR conversion service is not active.',
    CDA_SERVICE_NOT_ACTIVE: 'CCDA to FHIR conversion service is not active.',
    INTERNET_CONNECTION_ERROR:
        'Check your internet connection.', 
    INVALID_XML_DOCUMENT: 'Invalid xml document.',
    UNKOWN_ERROR: 'Unknown error occurred.',
    INVALID_HL7V2_API: 'Invalid HL7v2 Service URL',
    INVALID_CDA_API: 'Invalid C-CDA Service URL',
    TOKEN_ENDPOINT_NOT_FOUND: 'Token endpoint not found',
    INVALID_AUTH_CREDETIALS: 'Invalid auth credentials',
    INVALID_AUTH_CREDENTIALS_LOG: 'Invalid API key or invalid Token endpoint',
};

export const INFO_MESSAGES = {
    HEALTH_CARE_EXTENSION_ACTIVE: 'Health care extension is active',
    TRIGGERING_HL7V2_TO_FHIR: 'Triggering HL7 v2 to FHIR conversion command.',
    TRIGGERING_CDA_TO_FHIR: 'Triggering C-CDA to FHIR conversion command.',
    TRIGGERING_COPY_TO_CLIPBOARD: 'Triggering copy to clipboard command.',
    TRIGGERING_SAVE_TO_FILE: 'Triggering save to file command.',
    LOADING_INPUT: 'Loading input',
    SANITIZING_INPUT: 'Sanitizing input',
    CONVERTING_HL7V2_TO_FHIR: 'Converting HL7 v2 to FHIR resources.',
    CONVERTING_CDA_TO_FHIR: 'Converting C-CDA to FHIR resources.',
    DISPLAYING_OUTPUT: 'Displaying output in the Webview.',
};
