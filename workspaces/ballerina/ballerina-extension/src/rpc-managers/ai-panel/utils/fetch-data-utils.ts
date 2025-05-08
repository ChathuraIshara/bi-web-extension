/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { getAccessToken, refreshAccessToken } from "../utils";

export async function fetchData(url: string, options: RequestInit): Promise<Response> {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error("Authentication failed. Please log in again.");
        }

        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };

        let response = await fetch(url, options);

        if (response.status === 401) {
            const refreshedToken = await refreshAccessToken();
            if (!refreshedToken) {
                throw new Error("Session expired. Please log in again.");
            }

            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${refreshedToken}`,
            };

            response = await fetch(url, options);
        }

        return response;
    } catch (error) {
        throw error;
    }
}
