/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import axios from 'axios';
import { ERROR_MESSAGES } from '../constants/messages';
import { CDA_ENABLE_AUTHORIZATION, HL7v2_ENABLE_AUTHORIZATION, HL7v2_TOKEN_ENDPOINT, HL7v2_API_KEY, CDA_API_KEY, CDA_TOKEN_ENDPOINT } from '../constants/config';

let cachedToken: string | undefined = undefined;
let cachedToken_hl7v2: string | undefined = undefined;
let cachedToken_cda: string | undefined = undefined;

const auth = axios.create({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
});

/**
 * @description Clear the cached token
 * @returns - void
 */
export function clearCachedToken(type: string) {
    if (type === 'hl7v2') {
        cachedToken_hl7v2 = undefined;
    }
    if (type === 'cda') {
        cachedToken_cda = undefined;
    }
}

/**
 * @description Get the auth token from the server
 * @param clientId - The client id
 * @param clientSecret - The client secret
 * @returns - The auth token
 */
export async function getToken(convType:string, refresh = false): Promise<string | Error> {
    const enableAuth = convType === 'HL7v2' ? HL7v2_ENABLE_AUTHORIZATION : CDA_ENABLE_AUTHORIZATION;
    if (!enableAuth) {
        return '';
    }
    
    if (refresh) {
        cachedToken_hl7v2 = undefined;
        cachedToken_cda = undefined;
        cachedToken = undefined;
    }

    cachedToken = convType === 'HL7v2' ? cachedToken_hl7v2 : cachedToken_cda;
    if (cachedToken) {
        return cachedToken;
    }

    const apikey = convType === 'HL7v2' ? HL7v2_API_KEY : CDA_API_KEY;
    if (apikey === '' || apikey === undefined) {
        return new Error(
            ERROR_MESSAGES.API_KEY_NOT_FOUND +
                '::LOG::' +
                ERROR_MESSAGES.API_KEY_NOT_FOUND,
        );
    }

    const tokenEndpoint = convType === 'HL7v2' ? HL7v2_TOKEN_ENDPOINT: CDA_TOKEN_ENDPOINT;
    auth.defaults.baseURL = tokenEndpoint;
    if (tokenEndpoint === '' || tokenEndpoint === undefined) {
        return new Error(
            ERROR_MESSAGES.TOKEN_ENDPOINT_NOT_FOUND +
                '::LOG::' +
                ERROR_MESSAGES.TOKEN_ENDPOINT_NOT_FOUND,
        );
    }

    try {
        const response = await auth.post('/', "grant_type=client_credentials", {
            headers: {
                Authorization: `Basic ${Buffer.from(apikey).toString('base64')}`
            }
        });
        if (convType === 'HL7v2') {
            cachedToken_hl7v2 = response.data.access_token;
            return cachedToken_hl7v2;
        }
        cachedToken_cda = response.data.access_token;
        return cachedToken_cda;
    } catch (error) {
        if ((error as any).code === 'ENOTFOUND') {
            throw new Error(
                ERROR_MESSAGES.INTERNET_CONNECTION_ERROR +
                    '::LOG::' +
                    ERROR_MESSAGES.INTERNET_CONNECTION_ERROR,
            );
        }
        throw new Error(
            ERROR_MESSAGES.INVALID_AUTH_CREDETIALS +
                '::LOG::' +
                ERROR_MESSAGES.INVALID_AUTH_CREDENTIALS_LOG,
        );
    }
}
