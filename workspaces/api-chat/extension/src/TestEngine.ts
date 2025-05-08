/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { actions, createMachine, interpret, State, assign, EventObject } from 'xstate';
import API from './API';
// import { getLogger } from './logger/logger';
import { v4 as uuidv4 } from 'uuid';


const outputChannel = vscode.window.createOutputChannel('api-chat');

export type TestCommand = {
    type: "COMMAND";
    command: string;
}

interface Request {
    method: string;
    path: string;
    inputs: {
        requestBody: any;
        queryParameters: any;
        pathParameters: any;
    };
}

interface Response {
    code: number,
    payload: any
    headers: {
        contentType?: string
        contentLength: number
    }
}

export interface TestResult {
    type: "RESULT";
    request: Request;
    output: Response;
}

export interface TestError {
    type: "ERROR";
    message: string;
}

export interface FinalResult {
    type: "FINAL_RESULT";
    message: string;
}


export interface AuthBasic {
    type: "basic";
    username: string;
    password: string;
}

export interface AuthBearer {
    type: "bearer";
    token: string;
}

export interface AuthKey {
    type: "key";
    headerName: string;
    headerValue: string;
}

export interface AuthNone {
    type: "none"
}

export interface TestMachineContext {
    xRequestId?: string;
    openapi?: object;
    baseURL?: string;
    apiClient?: AxiosInstance;
    apiSpec?: any;
    queries?: any;
    command?: string;
    //requestState: {
    // Following will capture state on request execution
    nextRequest?: Request;
    taskStatus?: string;
    testCaseId?: string;
    executionError?: string;
    //}
    lastResult?: Response;
    logs: (TestCommand | TestResult | TestError | FinalResult)[];
    authData: AuthBasic | AuthBearer | AuthKey | AuthNone;
    errorMessage?: string;
    finalResult?: string;
}

interface SetOpenAPIEvent {
    openapi: object,
    type: string
}

interface SetCommandEvent {
    command: string,
    type: string
}

interface SetAuthData {
    authData: AuthBasic | AuthBearer | AuthKey | AuthNone;
    type: string;
}



export interface Queries {
    queries: string;
    scenario: string;
}


function extractApiUrl(openapi: any): string | undefined {
    let url = undefined;
    if (openapi && openapi.hasOwnProperty('servers') && Array.isArray(openapi.servers) && openapi.servers.length > 0) {
        const server = openapi.servers[0];
        if (server.hasOwnProperty('url') && typeof server.url === 'string') {
            url = server.url;
        }
        // Check openapi has variables if so request for the endpoint
        if (server.variables !== undefined) {
            url = undefined;
        }
    }
    return url;
}

function makeRequest(apiClient: AxiosInstance, request: Request, authData: any) {
    const path = replacePathParameters(request);
    request.path = path;

    switch (request.method) {
        case 'GET':
            return apiClient.get(path, {
                headers: generateAuthHeaders(authData)
            })
        case 'POST':
            return apiClient.post(path, request.inputs.requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    ...generateAuthHeaders(authData)
                }
            });
        case 'PUT':
            return apiClient.put(path, request.inputs.requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    ...generateAuthHeaders(authData)
                }
            });
        case 'PATCH':
            return apiClient.patch(path, request.inputs.requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    ...generateAuthHeaders(authData)
                }
            });
        case 'DELETE':
            return apiClient.delete(path, {
                headers: {
                    'Content-Type': 'application/json',
                    ...generateAuthHeaders(authData)
                }
            });

    }
    return Promise.reject('Unsupported method');
}

function replacePathParameters(request: Request): string {
    const pathParameters = request.inputs.pathParameters;
    const queryParameters = request.inputs.queryParameters;
    const pathParams = request.path.match(/{\w+}/g);
    let path: string = request.path;
    if (pathParams) {
        pathParams.forEach((param: string) => {
            const paramName = param.slice(1, -1);
            if (pathParameters.hasOwnProperty(paramName)) {
                path = path.replace(param, pathParameters[paramName]);
                delete pathParameters[paramName];
            }
        });
    }
    if (queryParameters) {
        const queryParams = Object.entries(queryParameters).map(([key, value]) => `${key}=${value}`).join('&');
        path += `?${queryParams}`;
    }
    return path;
}

const assignOpenAPI = assign<TestMachineContext, SetOpenAPIEvent>({
    xRequestId: (context, event) => uuidv4(),
    openapi: (context, event) => event.openapi,
    baseURL: (context, event) => undefined
});

const assignCommand = assign<TestMachineContext, SetCommandEvent>({
    command: (context, event) => event.command
});

const clearTestLogs = assign<TestMachineContext>({
    logs: (context) => []
});

const assignAuthData = assign<TestMachineContext, SetAuthData>({
    authData: (context, event) => event.authData
});


const getTools = (context: TestMachineContext, event: any) => {
    outputChannel.appendLine("Loading new OpenAPI id=" + context.xRequestId);
    return new Promise((resolve, reject) => {
        API.ready().then((client: any) => {
            client.post('/prepare', { openapi: context.openapi }, {
                headers: {
                    "x-request-id": context.xRequestId
                }
            })
                .then((response: { status: number; data: unknown; }) => {
                    if (response.status === 201) {
                        resolve(response.data);
                    } else {
                        reject(new Error('Request failed'));
                    }
                })
                .catch((error: any) => {
                    // if error has a response payload then return message from payload
                    if (error.response && error.response.data && error.response.data.message) {
                        reject(error.response.data.message);
                        return;
                    }
                    reject(error.message);
                });
        }).catch((error) => {
            reject(error.message);
        });
    });
};

const executeCommand = (context: TestMachineContext, event: any) => {
    return new Promise((resolve, reject) => {
        const payload = (context.taskStatus === undefined) ?
            { apiSpec: context.apiSpec, command: context.command } :
            {
                response: {
                    code: context.lastResult?.code,
                    body: context.lastResult?.payload,
                    headers: context.lastResult?.headers,
                }
            };
        API.ready().then((client: any) => {
            client.post('/execute', payload, {
                headers: {
                    "x-request-id": context.xRequestId
                }
            })
                .then((response: { status: number; data: any; }) => {
                    if (response.status === 201) {
                        resolve(response.data);
                    } else {
                        reject(response.data);
                    }
                })
                .catch((error: any) => {
                    // if error has a response payload then return meesage from payload
                    if (error.response && error.response.data && error.response.data.message) {
                        reject(error.response.data.message);
                    }
                    // else return error message
                    reject(error.message);
                });
        }).catch((error) => {
            reject(error.message);
        });
    });
};

const initExecution = (context: TestMachineContext, event: any) => {
    return new Promise((resolve, reject) => {
        if (context.command) {
            const log: TestCommand = { command: context.command, type: "COMMAND" };
            context.logs.push(log);
        }
        resolve({});
    });
}

const executeRequest = (context: TestMachineContext, event: any) => {
    return new Promise((resolve, reject) => {
        // if the status is completed skip
        if (context.taskStatus == "COMPLETED") {
            // nothing to do return empty object
            resolve({});
        }
        const apiClient = context.apiClient;
        const request = context.nextRequest;
        if (apiClient === undefined) {
            reject("API Url is not defined");
        } else {
            if (request === undefined) {
                reject("Request is not defined");
            }
            else {
                makeRequest(apiClient, request, context.authData)
                    .then((response: AxiosResponse) => {
                        outputChannel.appendLine(generateCurlCommand(response));
                        const mappedResponse: Response = {
                            code: response.status,
                            payload: response.data,
                            headers: {
                                contentLength: Number(response.headers?.getContentLength) || 0,
                                contentType: response.headers['Content-Type']?.toString()
                            }
                        };
                        resolve(mappedResponse);
                    }).catch((error: AxiosError) => {
                        if (error.response == undefined) {
                            outputChannel.appendLine("Error on executing command");
                            reject(convertNetworkErrorToMessage(error));
                        } else {
                            outputChannel.appendLine(generateCurlCommand(error.response));
                            const mappedResponse: Response = {
                                code: error.response?.status || 0,
                                payload: error.response?.data,
                                headers: {
                                    contentLength: Number(error.response?.headers?.getContentLength) || 0,
                                    contentType: error.response?.headers['Content-Type']?.toString()
                                }
                            };
                            resolve(mappedResponse);
                        }
                    });
            }
        }
    });
};

const processRequest = (context: TestMachineContext, event: any) => {
    return new Promise((resolve, reject) => {
        if (context.executionError) {
            const log: TestError = { message: context.executionError, type: "ERROR" };
            context.logs.push(log);
        }
        else if (context.finalResult) {
            let log: FinalResult = {
                type: 'FINAL_RESULT',
                message: context.finalResult
            }
            context.logs.push(log);
            context.finalResult = undefined;
        }
        //todo combine to create log
        else if (context.nextRequest && context.lastResult) {
            let log: TestResult = {
                type: "RESULT",
                request: context.nextRequest,
                output: context.lastResult
            };
            context.logs.push(log);
        }
        resolve({ taskStatus: context.taskStatus });
    });
};

const createClient = (context: TestMachineContext, event: any) => {
    return new Promise((resolve, reject) => {
        if (context.baseURL === undefined) {
            const url = extractApiUrl(context.openapi);
            outputChannel.appendLine("Ditected URL :" + url);
            if (url === undefined) {
                reject();
            }
            context.baseURL = url;
        }
        const client = axios.create({
            baseURL: context.baseURL
        })
        resolve(client);
    });
}

const generateAuthHeaders = (authData: AuthBasic | AuthBearer | AuthKey | AuthNone): Record<string, string> => {
    let headers: Record<string, string> = {};

    switch (authData.type) {
        case "none":
            break;
        case "basic":
            headers["Authorization"] = `Basic ${btoa(`${authData.username}:${authData.password}`)}`;
            break;
        case "bearer":
            headers["Authorization"] = `Bearer ${authData.token}`;
            break;
        case "key":
            headers[authData.headerName] = authData.headerValue;
            break;
        default:
            break;
    }

    return headers;
};

function generateCurlCommand(response: AxiosResponse): string {
    const { config, data } = response;
    const { method, url, headers } = config;

    let curlCommand = `curl -X ${method} "${url}"`;

    // Add headers to the curl command
    if (headers) {
        Object.keys(headers).forEach((key) => {
            const value = headers[key];
            curlCommand += ` -H "${key}: ${value}"`;
        });
    }

    // Add request body to the curl command
    if (data) {
        const body = JSON.stringify(data);
        curlCommand += ` -d '${body}'`;
    }

    return curlCommand;
}

function convertNetworkErrorToMessage(error: AxiosError): string {
    if (!error.code) {
        return "Unknown error occurred.";
    }

    switch (error.code) {
        case 'EAI_AGAIN':
            return "DNS lookup timed out. The server may be temporarily unavailable.";
        case 'ENOTFOUND':
            return "The requested address was not found. Please check the URL.";
        case 'ECONNREFUSED':
            return "The server refused the connection. It might be down or not accepting requests.";
        case 'ETIMEDOUT':
            return "The request timed out. The server might be too slow or overloaded.";
        case 'ECONNRESET':
            return "The connection was reset. The server might have closed the connection unexpectedly.";
        case 'ENETUNREACH':
            return "Network is unreachable. Please check your internet connection.";
        case 'EHOSTUNREACH':
            return "No route to the host. Please check the server address and your network connection.";
        case 'EHOSTDOWN':
            return "The server is down and not responding to requests.";
        case 'EPIPE':
            return "The connection was broken. Please try again later.";
        default:
            return `An unknown network error occurred: ${error.code}`;
    }
}


const testMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QBU4BcCiA7KBLLYAxAEoYDKGyA2gAwC6ioADgPay5q4taMgAeiAIw0AHADoArACYA7IIDMUwYIAsK+TJkBOADQgAnogC0msSqnzBWrTPkTVcgGwBfZ3tSxMOfEVIAxUjIACVoGJBBWdk5uXgEEKXUZMS0VeyUREXtHCT1DBCMVRzEMkS1ZO0FS2xTXd3RsPAIxfA5CCmQAfQB5AAUMADkAQR6ASVDeSI4uHnC4q3kiwQlHcus7TRFcxFlxGilRDRE9o4ktWpAPL0awMQAbFgBDCHwoMRg0ZBYWW9hCCG4bvgAG4sADWN3en2+sHG4Um0RmoDiFgsYkc6JkiRo8nMIhUWwQyxoYg0EhoyhEjmEgnOlwaPjuj2eODeYA+Xx+hDAACduSxuWImLcHmgAGb8gC2rPZ0NhzDYUxis22MikEkklhxgnReJojgJakEYkEauxNBkRxo5hcbgu9W8TXuTxeYgAxtywCKwABhW64MBYNB-AHNLAg8Fuj1e33+wNyiIKhGxFVqjUKFTaxy6-UGFOSfYiLWFRwpVS0+3XRnOlnuz1oH1+gNBnl8gVCkXi7lS2vRxtx+gTRPTZPxRTyNEYrE4qR4gmyI0aFTWCTyGwrPHlzz0x1Ml3vACq3NubUoHX3xAAMvH4cPlaPUejHJiNNjcfjcwhLOIRJitBlHPIIgWFa8iblcDJRhA+iEBgAAaGDevuyAYNeQ5KkiQgyE+JKaMo1iqjOKibB+ygKGImjmloSz-gBYHbjckHQd6F4YIMxCoVEt4YZ+ezqjsVL2KIjjvnkwlFDO1gZiWpwAWctp0g6DGelBhDel0-R+CMADi54YB0zEjAM1ADnCaGIvw2ynLs5irpkKxSOiBJ2WYEhASIpGCcsdGKWIYB8GAroAK6cDghCaf0IzBBxirmciNA0Oqqortk2hWtIxF5NY4g2FhpRLCWjg0HJdRbj5fkBcFLotJg-lBQiwZNMCYKAlgHAYK6FUItFSZ3hYRQJVYNhlHqQESCJiAqJiaJWsI1gmquRESN5lblXVLqimyroABbEGAACOgXoA1LXhjcq3BWA3VcRZCCFeOWiufI5IOeoAHjQgcgqMkqXJcsCglstDLnSFrwbWg227QdR0tvygrCmKkq+bVF1XehN13ckj3PcJCw4gaUhaGICTLmawjmEt8kVkDyMg0jnVgJDh2eMdoanXTdUM-tTNoKjsWIFoOLGhR2RkulUgEjI8XkQToiSZqlSA00wMusDnNQ8zMNtvDnZSqrjPoLzI5aCWySVNICWFio5pOeoJIzmqTgONIitnTTLpMHyHWwLA+vM-8jVhs1gqe3APtcwbJnypxaNzOoUjkQcihOBsGWIDjxoJBkEi2IUOUu+zlUsh7LBe2H6tBv7J1B8Xpe+zzghhFHMVG4LgjCxIov2wSpz3a5aolnqRXZPnytFyH3t11yvKw+2CNdsHJeh3Xht3qoigJ4WSfain3cPWixMWNnsgATSlOlSt0-ciQlDEAAmiv3H7CkaKqIVWjYuiRVOUaZLxeSwhSCUF5M+4ElZuxZGDCG4dmZkGQL0B+N0xpFEKkuI47k7oWgJAA+OX4lgOQtFmICI9wGvD1tAoMsD4GRwTNHPmH0BbGlEFaC0xsjgWAJGUQmb9SgaCUFbCmtosAsAgHAXgClriDloSOIwCQCRGG1F9MolgkqSypJNKQ+dqqSObnePEaIqLbyetIPq70TRfXSjiOaKxJrknzk6ZkUBtE9UfqRF+hQiofzflgwsRNf6qGWDiSkog7G7hZJCDk8BTJSN6ksLhr8PELC8R+dQxIfxkm1HqeYJobQlVATcexLoez1hjE2Jx11kRZDMNoGcsTsSlDnJLciS4-zVFKMlFQITqyvAPEeMpMdthWGQRiH8g0gKCAaeqB6hYZYW0mjIfOjE+l0JnEBEk6gfyEU0H1JyywXKFnNEoY2Ggcl2nPtTTqLwlkjlkR+LUTT8KYhFr+DpID6IF1ptVDAbs0Y3n6R9cWySySMKtjYAmk01AaNeWVEhYhIE7XIVcu85hFGZPRKcGQY1rQGiBWTIqqoUiYnMMQi5LIyHl0RdxLC8cCbamkLS422cJZkQLBYbQP49QaGJWtMei8J4IqiTo7i2TiT4tUBkQByhRDd0yDhJcohMiFHsCILlhdSFYAgBSm6bcNDAsqO-aQKxsjSuJG3IieJCxWD2KfXJbzNaauRO-LhuEqJZkAacHIH535iETooQqo1hLKtcM4IAA */
    id: "TestEngine",
    initial: "init",
    predictableActionArguments: true,
    schema: {
        context: {} as TestMachineContext
    },
    context: {
        openapi: undefined,
        logs: [],
        authData: { type: "none" }
    },
    states: {
        init: {
            on: {
                SET_OPENAPI: {
                    target: "loading",
                    actions: assignOpenAPI
                }
            }
        },

        loading: {
            initial: "getTools",

            states: {
                getTools: {
                    invoke: {
                        id: "getTools",
                        src: getTools,
                        onDone: {
                            target: "createClient",
                            actions: assign({
                                apiSpec: (context, event) => event.data.apiSpec,
                                queries: (context, event) => event.data.queries
                            })
                        },
                        onError: {
                            target: "#TestEngine.error",
                            actions: assign({
                                errorMessage: (context, event) => event.data
                            })
                        }
                    }
                },
                createClient: {

                    invoke: {
                        id: "createClient",
                        src: createClient,
                        onDone: {
                            target: "#TestEngine.ready",
                            actions: assign({
                                apiClient: (context: any, event: { data: any; }) => event.data,
                            })
                        },
                        onError: {
                            target: "getUrl"
                        }
                    }
                },
                getUrl: {
                    on: {
                        SET_URL: {
                            target: "createClient",
                            actions: assign({
                                baseURL: (context: any, event: { url: string }) => event.url
                            })
                        }
                    }
                }
            }
        },
        ready: {
            on: {
                EXECUTE: {
                    target: "executing",
                    actions: assignCommand
                },

                CLEAR: {
                    target: "ready",
                    actions: clearTestLogs
                },

                CONFIGURE_CLIENT: {
                    target: "loading.createClient",
                    actions: assignAuthData
                }
            }
        },

        executing: {
            initial: "initExecution",
            on: {
                FINISH: "ready"
            },
            states: {
                initExecution: {
                    invoke: {
                        id: "initEcecution",
                        src: initExecution,
                        onDone: {
                            target: "fetchRequest"
                        }
                    }
                },
                fetchRequest: {
                    invoke: {
                        id: "execute",
                        src: executeCommand,
                        onDone: {
                            target: "executeRequest",
                            actions: assign({
                                nextRequest: (context, event) => event.data.resource,
                                taskStatus: (context, event) => event.data.taskStatus,
                                testCaseId: (context, event) => event.data.testCaseId,
                                finalResult: (context, event) => event.data.result,
                                executionError: undefined
                            })
                        },
                        onError: {
                            target: "processRequest",
                            actions: assign({
                                executionError: (context, event) => event.data,
                                taskStatus: "TERMINATED"
                            })
                        }
                    },

                    on: {
                        STOP: "end"
                    }
                },
                executeRequest: {
                    invoke: {
                        id: "executeRequest",
                        src: executeRequest,
                        onDone: {
                            target: "processRequest",
                            actions: assign({
                                lastResult: (context, event) => event.data
                            })
                        },
                        onError: {
                            target: "processRequest",
                            actions: assign({
                                executionError: (context, event) => event.data,
                                taskStatus: "TERMINATED"
                            })
                        }
                    },

                    on: {
                        STOP: "end"
                    }
                },
                processRequest: {
                    invoke: {
                        id: "processRequest",
                        src: processRequest,
                        onError: {
                            target: "end",
                        },
                        onDone: [
                            { target: "end", cond: (context, event) => context.taskStatus === "COMPLETED" || context.taskStatus === "TERMINATED" },
                            { target: "fetchRequest", cond: (context, event) => context.taskStatus === "IN_PROGRESS" },
                        ]
                    }
                },
                end: {
                    invoke: {
                        src: (context, event) => (callback, onReceive) => {
                            context.taskStatus = undefined;
                            callback('FINISH');
                        },
                    },
                }
            }
        },
        error: {
            on: {
                RETRY: "loading"
            }
        }
    },
    on: {
        RESET: {
            target: "init",
            // @ts-ignore
            actions: assign(ctx => {
                return { openapi: undefined, logs: [], authData: { type: "none" } };
            })
        },
        REFRESH: {
            target: "loading",
            // @ts-ignore
            actions: assign(ctx => {
                return { logs: [] };
            })
        }
    }
});

let service = interpret(testMachine);
service.start();

export function getService() {
    return service;
}

export function setOpenAPI(openapi: object) {
    service.send({ type: "SET_OPENAPI", openapi: openapi });
}

export function retry() {
    service.send({ type: "retry" });
}

export function getState() {
    return service.state.value;
}

export function runExecute(command: string) {
    service.send({ type: "EXECUTE", command });
}

export function reset() {
    service.send({ type: "RESET" });
}

export function getLogs() {
    service.getSnapshot().context.logs
}

export function clearLogs() {
    service.send({ type: "CLEAR" });
}

export function refresh() {
    service.send({ type: "REFRESH" });
}

export function setUrl(url: string) {
    service.send({ type: "SET_URL", url: url });
}

export function setAuthentication(authData: AuthBasic | AuthBearer | AuthKey | AuthNone) {
    service.send({ type: "CONFIGURE_CLIENT", authData: authData });
}

export function getAuthentication(): AuthBasic | AuthBearer | AuthKey | AuthNone {
    return service.getSnapshot().context.authData;
}

export function stopExecution() {
    service.send({ type: "STOP" });
}


