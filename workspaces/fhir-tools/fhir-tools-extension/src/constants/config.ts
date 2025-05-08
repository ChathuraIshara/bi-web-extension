/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import { clearCachedToken } from '../services/auth';

dotenv.config();
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DEFAULT_APIKEY = process.env.CLIENT_SECRET;
const DEFAULT_TOKEN_ENDPOINT =
    'https://api.asgardeo.io/t/wso2healthtools/oauth2/token';
const DEFAULT_HL7v2_API =
    'https://880ea8ae-f125-4d0d-9346-c403f9c106db-prod.e1-us-east-azure.choreoapis.dev/kifl/v2-to-fhirr4-service/endpoint-9090-803/v1.0/transform';
const DEFAULT_CDA_API =
    'https://880ea8ae-f125-4d0d-9346-c403f9c106db-prod.e1-us-east-azure.choreoapis.dev/kifl/ccda-to-fhirr4-service/endpoint-9090-803/v1.0/transform';

export let HL7v2_API = DEFAULT_HL7v2_API;
export let HL7v2_TOKEN_ENDPOINT = DEFAULT_TOKEN_ENDPOINT;
export let HL7v2_API_KEY = DEFAULT_APIKEY;
export let HL7v2_ENABLE_AUTHORIZATION = true;

export let CDA_API = DEFAULT_CDA_API;
export let CDA_TOKEN_ENDPOINT = DEFAULT_TOKEN_ENDPOINT;
export let CDA_API_KEY = DEFAULT_APIKEY;
export let CDA_ENABLE_AUTHORIZATION = true;

let user_settings_hl7v2 = false;
let user_settings_cda = false;

/**
 * @description - Listen to configuration changes
 * @returns - void
 */
export function listenToConfigurationChanges() {
    updateConfigs();
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (
            event.affectsConfiguration('fhir-tools › HL7v2ToFHIR.ServiceURL') ||
            event.affectsConfiguration('fhir-tools › C-CDA ToFHIR.ServiceURL') ||
            event.affectsConfiguration('fhir-tools.authorization.tokenEndpoint') ||
            event.affectsConfiguration('fhir-tools.authorization.consumerKey') ||
            event.affectsConfiguration('fhir-tools.authorization.consumerSecret') ||
            event. affectsConfiguration('fhir-tools.authorization.enableAuthorization')
        ) {
            updateConfigs();
        }
    });
}

/**
 * @description - Update the configurations if the user changes the settings. If the user has not changed the settings, the default settings will be used.
 * @returns - void
 */
function updateConfigs() {
    let HL7v2_API_USER = vscode.workspace
        .getConfiguration()
        .get('fhir-tools › HL7v2ToFHIR.ServiceURL') as string;
    let CDA_API_USER = vscode.workspace
        .getConfiguration()
        .get('fhir-tools › C-CDA ToFHIR.ServiceURL') as string;
    let TOKEN_ENDPOINT_USER = vscode.workspace
        .getConfiguration()
        .get('fhir-tools.authorization.tokenEndpoint') as string;
    let CONSUMER_KEY = vscode.workspace
        .getConfiguration()
        .get('fhir-tools.authorization.consumerKey') as string;
    let CONSUMER_SECRET = vscode.workspace
        .getConfiguration()
        .get('fhir-tools.authorization.consumerSecret') as string;
    let APIKEY_USER = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
    let ENABLE_AUTHORIZATION_USER = vscode.workspace
        .getConfiguration()
        .get('fhir-tools.authorization.enableAuthorization') as boolean;

    if (HL7v2_API_USER === '' || HL7v2_API_USER === undefined) {
        HL7v2_API = DEFAULT_HL7v2_API;
        HL7v2_TOKEN_ENDPOINT = DEFAULT_TOKEN_ENDPOINT;
        HL7v2_API_KEY = DEFAULT_APIKEY;
        HL7v2_ENABLE_AUTHORIZATION = true;
        user_settings_hl7v2 = false;
    } else {
        HL7v2_API = HL7v2_API_USER;
        HL7v2_TOKEN_ENDPOINT = TOKEN_ENDPOINT_USER;
        HL7v2_API_KEY = APIKEY_USER;
        HL7v2_ENABLE_AUTHORIZATION = ENABLE_AUTHORIZATION_USER;
        if (!user_settings_hl7v2){
            clearCachedToken("hl7v2");
        }
        user_settings_hl7v2 = true;
    }

    if (CDA_API_USER === '' || CDA_API_USER === undefined) {
        CDA_API = DEFAULT_CDA_API;
        CDA_TOKEN_ENDPOINT = DEFAULT_TOKEN_ENDPOINT;
        CDA_API_KEY = DEFAULT_APIKEY;
        CDA_ENABLE_AUTHORIZATION = true;
        user_settings_cda = false;
    } else {
        CDA_API = CDA_API_USER;
        CDA_TOKEN_ENDPOINT = TOKEN_ENDPOINT_USER;
        CDA_API_KEY = APIKEY_USER;
        CDA_ENABLE_AUTHORIZATION = ENABLE_AUTHORIZATION_USER;
        if (!user_settings_cda){
            clearCachedToken("cda");
        }
        user_settings_cda = true;
    }

}
