/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp?: number;
}

interface FetchWithAuthParams {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    token: string;
    body?: any;
    rpcClient: any;
}

// Global controller for aborting requests
let controller: AbortController | null = null;

export const fetchWithAuth = async ({
    url,
    method,
    token,
    body,
    rpcClient,
}: FetchWithAuthParams): Promise<Response> => {
    controller?.abort();

    controller = new AbortController();
    let finalToken = token;

    // Decode token and check expiration
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
            finalToken = await rpcClient.getAiPanelRpcClient().getRefreshToken();
        }
    } catch (err) {
        console.warn("Failed to decode token, using original token.");
    }

    const makeRequest = async (authToken: string): Promise<Response> =>
        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller!.signal,
        });

    let response = await makeRequest(finalToken);

    if (response.status === 401) {
        finalToken = await rpcClient.getAiPanelRpcClient().getRefreshToken();
        if (finalToken) {
            response = await makeRequest(finalToken);
        }
    }

    return response;
}

// Function to abort the fetch request
export function abortFetchWithAuth() {
    if (controller) {
        controller.abort();
        controller = null;
    }
}

