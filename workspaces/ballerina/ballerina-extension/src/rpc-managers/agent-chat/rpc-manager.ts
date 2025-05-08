/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */

import {
    AgentChatAPI,
    ChatReqMessage,
    ChatRespMessage,
} from "@wso2-enterprise/ballerina-core";
import { extension } from '../../BalExtensionContext';

export class AgentChatRpcManager implements AgentChatAPI {
    private currentAbortController: AbortController | null = null;

    async getChatMessage(params: ChatReqMessage): Promise<ChatRespMessage> {
        return new Promise(async (resolve, reject) => {
            try {
                if (
                    !extension.agentChatContext.chatEp || typeof extension.agentChatContext.chatEp !== 'string' ||
                    !extension.agentChatContext.chatSessionId || typeof extension.agentChatContext.chatSessionId !== 'string'
                ) {
                    throw new Error('Invalid Agent Chat Context: Missing or incorrect ChatEP or ChatSessionID!');
                }

                this.currentAbortController = new AbortController();
                const response = await this.fetchTestData(
                    extension.agentChatContext.chatEp,
                    { sessionId: extension.agentChatContext.chatSessionId, ...params },
                    this.currentAbortController.signal
                );
                if (response && response.message) {
                    resolve(response as ChatRespMessage);
                } else {
                    reject(new Error("Invalid response format:", response));
                }
            } catch (error) {
                reject(error);
            } finally {
                this.currentAbortController = null;
            }
        });
    }

    async abortChatRequest(): Promise<void> {
        if (this.currentAbortController) {
            this.currentAbortController.abort();
            this.currentAbortController = null;
        }
    }

    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    private async fetchTestData(url: string, payload: Record<string, any>, signal: AbortSignal): Promise<Record<string, any>> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal,
            });

            if (!response.ok) {
                switch (response.status) {
                    case 400:
                        throw new Error("Bad Request: The server could not understand the request.");
                    case 401:
                        throw new Error("Unauthorized: Authentication is required.");
                    case 403:
                        throw new Error("Forbidden: You do not have permission to access this resource.");
                    case 404:
                        throw new Error("Not Found: The requested resource could not be found.");
                    case 408:
                        throw new Error("Request Timeout: The server took too long to respond.");
                    case 500:
                        throw new Error("Internal Server Error: Something went wrong on the server.");
                    case 502:
                        throw new Error("Bad Gateway: Received an invalid response from the upstream server.");
                    case 503:
                        throw new Error("Service Unavailable: The server is temporarily unavailable.");
                    case 504:
                        throw new Error("Gateway Timeout: The server took too long to respond.");
                    default:
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                // Provide a custom message for aborted request
                throw new Error("Request aborted by the user.");
            }

            let errorMessage = "An unknown error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }
}
