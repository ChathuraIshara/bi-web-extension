/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { Messenger } from 'vscode-messenger';
import { NotificationType, RequestType } from "vscode-messenger-common";
import {
    getService, runExecute, clearLogs, getState, TestCommand,
    TestResult, Queries, refresh, setUrl, setAuthentication, getAuthentication,
    AuthBasic, AuthBearer, AuthKey, AuthNone, TestError, stopExecution, FinalResult
} from './TestEngine';
import { error } from 'console';

export const messenger = new Messenger();

interface StateChangeEvent {
    state: string;
    logs: (TestCommand | TestResult | TestError | FinalResult)[];
    queries: Queries[];
    errorMessage?: string;
}

// Handle incoming view notification
const executeTest: NotificationType<string> = { method: 'executeTest' };
const setUrlNotification: NotificationType<string> = { method: 'setUrl' };
const stateChanged: NotificationType<StateChangeEvent> = { method: 'stateChanged' };
const getStateValue: RequestType<string, string> = { method: 'getState' };
const clearTestLogs: NotificationType<void> = { method: 'clearLogs' };
const refreshConsole: NotificationType<void> = { method: 'refreshConsole' };
const setAuthenticationNotification: NotificationType<void> = { method: 'setAuthentication' };
const getAuthenticationNotification: NotificationType<void> = { method: 'getAuthentication' };
const stopExecutionNotification: NotificationType<void> = { method: 'stopExecution' };
const runAsCurlNotification: NotificationType<TestResult> = { method: 'runAsCurl' };
const openInRestClientNotification: NotificationType<TestResult> = { method: 'openRESTClient' };


// Inform console of changing state
getService().onTransition((state) => {
    const snapshot: StateChangeEvent = {
        state: stateString(state.value),
        logs: state.context.logs,
        queries: state.context.queries,
        errorMessage: state.context.errorMessage
    };
    messenger.sendNotification(stateChanged, { type: 'webview', webviewType: 'APIChatConsole' }, snapshot);
});

// Execute Tests
messenger.onRequest(executeTest, (params: string) => {
    runExecute(params);
});

// Execute Tests
messenger.onRequest(setUrlNotification, (params: string) => {
    setUrl(params);
});

// Get the initial state for console
messenger.onRequest(getStateValue, () => {
    return stateString(getState());
});


// Clear Logs
messenger.onRequest(clearTestLogs, () => {
    clearLogs();
});

// Refresh the console
messenger.onRequest(refreshConsole, () => {
    refresh();
});

messenger.onRequest(stopExecutionNotification, () => {
    stopExecution();
});

function stateString(state: any): string {
    if (typeof state === 'string') {
        return state;
    } else if (typeof state === 'object') {
        const stateString = Object.entries(state).map(([key, value]) => `${key}.${value}`).at(0);
        if (stateString === undefined) {
            throw error("Undefined state");
        } else {
            return stateString;
        }
    } else {
        throw error("Undefined state");
    }
}

messenger.onRequest(setAuthenticationNotification, (authData: AuthBasic | AuthBearer | AuthKey | AuthNone) => {
    return setAuthentication(authData);
});

messenger.onRequest(getAuthenticationNotification, () => {
    return getAuthentication();
});

messenger.onRequest(runAsCurlNotification, () => {
    console.log("Run as cURL");
});

messenger.onRequest(openInRestClientNotification, () => {
    console.log("Open rest client");
});
