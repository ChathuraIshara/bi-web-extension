/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getToken } from './auth';
import { ERROR_MESSAGES } from '../constants/messages';
import { HL7v2_API, CDA_API } from '../constants/config';
import { CCDAErrorResponse } from "@wso2-enterprise/fhir-tools-core";

let CurConvType: string = "";

const instance = axios.create({
    headers:{
        'Content-Security-Policy': "script-src-attr 'self';"
    },
});

const API = {
    ready: (convType: string): Promise<AxiosInstance> => {
        CurConvType = convType;
        return new Promise<AxiosInstance>((resolve, reject) => {
            getToken(convType)
                .then((token) => {
                    const conv_instance = convType === 'HL7v2' ? setHL7v2API() : setCDAAPI();
                    conv_instance.defaults.headers['Authorization'] = `Bearer ${token}`;
                    resolve(conv_instance);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

function setHL7v2API(): AxiosInstance {
    if (HL7v2_API === '' || HL7v2_API === undefined) {
        throw new Error(
            ERROR_MESSAGES.INVALID_HL7V2_API +
                '::LOG::' +
                ERROR_MESSAGES.INVALID_HL7V2_API,
        );
    }
    instance.defaults.baseURL = HL7v2_API;
    instance.defaults.headers['Content-Type'] = 'text/plain';
    return instance;
}

function setCDAAPI(): AxiosInstance {
    if (CDA_API === '' || CDA_API === undefined) {
        throw new Error(
            ERROR_MESSAGES.INVALID_CDA_API +
                '::LOG::' +
                ERROR_MESSAGES.INVALID_CDA_API,
        );
    }
    instance.defaults.baseURL = CDA_API;
    instance.defaults.headers['Content-Type'] = 'application/xml';
    return instance;
}

instance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            try{
                // Refresh token
                const token = await getToken(CurConvType, true);
                if (token instanceof Error) {
                    return Promise.reject(token);
                }
                error.config.headers['Authorization'] = `Bearer ${token}`;
                instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return axios.request(error.config);
            } catch (refreshError){
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export function handleError(errResponse: AxiosResponse, convType: string): string {
    if (errResponse.status === 503){
        return ERROR_MESSAGES.INTERNET_CONNECTION_ERROR + "::LOG::" + (convType === 'HL7v2' ? ERROR_MESSAGES.HL7V2_SERVICE_NOT_ACTIVE : ERROR_MESSAGES.CDA_SERVICE_NOT_ACTIVE);
    }
    if (errResponse.status === 404){
        if (convType === "HL7v2") {
            return ERROR_MESSAGES.INVALID_HL7V2_API + "::LOG::" + ERROR_MESSAGES.INVALID_HL7V2_API;
        }
        else{
            return ERROR_MESSAGES.INVALID_CDA_API + "::LOG::" + ERROR_MESSAGES.INVALID_CDA_API;
        }
    }

    if (convType === 'CDA') {
        let body = errResponse.data as CCDAErrorResponse;
        return ERROR_MESSAGES.INVALID_XML_DOCUMENT + "::LOG::" + body.issue[0].details.text;
    }
    else{
        const body = errResponse.data;
        const messages = body.split(' Error: ');
        return messages[1] + "::LOG::" + body;
    }
}

export default API;
