/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import axios, { AxiosInstance } from "axios";
import * as dotenv from "dotenv";
import { getLogger } from "./logger/logger";
dotenv.config();

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'https://dev-tools.wso2.com/yfko/api-chat/endpoint-9090-803/v1.0/',
    headers: {
        "User-Agent": "API Chat/VSCode"
    }
});

const path = require('path')
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const auth = axios.create({
    baseURL: 'https://api.asgardeo.io/t/wso2devtools/oauth2/token'
})

const apiKey = process.env.API_CHAT_API_KEY;
let accessToken: string | undefined;

// Resolve Oauth client credential
const resolveOauthClientCredential = async () => {
    // Your code here to resolve Oauth client credential
    if (!apiKey) {
        getLogger().error('API CHAT API KEY is not defined');
        throw new Error('API CHAT APIKEY is not defined.');
    }



    if (accessToken) {
        return;
    }


    const response = await auth.post('/', "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
    });
    accessToken = response.data.access_token;
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    getLogger().debug("Succesfully authenticated");
};

const API = {
    ready: (): Promise<AxiosInstance> => {
        return new Promise<AxiosInstance>((resolve, reject) => {
            resolveOauthClientCredential()
                .then(() => {
                    resolve(instance);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

// Function to refresh the access token
const refreshAccessToken = async () => {
    // Your code here to resolve Oauth client credential
    if (!apiKey) {
        getLogger().error('API CHAT API KEY is not defined');
        throw new Error('API CHAT APIKEY is not defined.');
    }

    const response = await auth.post('/', "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
    });
    return response.data.access_token;
};

// Interceptor to automatically refresh token on 401 error
instance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                accessToken = await refreshAccessToken();
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                getLogger().error('Access token refreshed');
                return axios.request(error.config);
            } catch (refreshError) {
                getLogger().error('Error while refreshing access token');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default API;
