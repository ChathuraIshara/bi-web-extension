/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createMachine, assign, interpret } from 'xstate';
import API, { handleError } from './services/convert';
import {v4 as uuidv4} from 'uuid';
import { WebView } from './WebView/WebView';
import { Logger } from './logger/logger';
import { readFileSync } from 'fs';
import { StateMachineContext, SetInputDataEvent } from '@wso2-enterprise/fhir-tools-core';  
import { ERROR_MESSAGES } from './constants/messages';

const assignInputData = assign<StateMachineContext, SetInputDataEvent>({
    xRequestId: (context, event) => uuidv4(),
    inputData: (context, event) => event.inputData,
    convType: (context, event) => event.convType,
    filePath: (context, event) => event.filePath
});

const convert = async (context: StateMachineContext, event: any) => {
    Logger.log({message: 'Converting the input data', type: 'INFO'});
    return new Promise((resolve, reject) => {
        API.ready(context.convType)
            .then((instance) => {
                instance
                    .post('', context.inputData)
                    .then((response) => {
                        Logger.log({message: 'Conversion successful', type: 'INFO'});
                        resolve({"outputData": JSON.stringify(response.data, null, 2)});
                    })
                    .catch  ((error) => {
                        Logger.log({message: 'Conversion failed', type: 'ERROR'});
                        console.log(error.message);
                        let errMsg: string[] = [];
                        if (error.message.includes('ECONNREFUSED')) {
                            errMsg = [context.convType === "HL7v2" ? ERROR_MESSAGES.INVALID_HL7V2_API : ERROR_MESSAGES.INVALID_CDA_API, error.message];
                        }
                        else if (error.message.includes('::LOG::')) {
                            errMsg = error.message.split('::LOG::');
                        }
                        else{
                            errMsg = handleError(error.response, context.convType).split('::LOG::');
                        }
                        Logger.log({message: errMsg[1], type: 'ERROR'});
                        reject({"error": errMsg[0]});
                    });
            })
            .catch((error) => {
                console.log(error);
                Logger.log({message: 'Conversion failed', type: 'ERROR'});
                let errMsg: string[] = [];
                if (error.message.includes('::LOG::')) {
                    errMsg = error.message.split('::LOG::');
                }
                else{
                    errMsg = handleError(error.response, context.convType).split('::LOG::');
                }
                reject({"error": errMsg[0]});
            });
    });
};

const dispalyOutput = (context: StateMachineContext, event: any) => {
    if (!WebView.currentPanel) {
        WebView.currentPanel = new WebView();
    }
    Logger.log({message: 'Displaying the output', type: 'INFO'});
    WebView.currentPanel!.setOutputData(context.outputData!);
    WebView.currentPanel!.getWebview()?.reveal();
};

const displayError = (context: StateMachineContext, event: any) => {
    if (!WebView.currentPanel) {
        WebView.currentPanel = new WebView();
    }
    Logger.log({message: 'Displaying the error', type: 'INFO'});
    WebView.currentPanel!.getWebview()?.reveal(); 
};

const displayLoading = (context: StateMachineContext, event: any) => {
    if (!WebView.currentPanel) {
        WebView.currentPanel = new WebView();
    }
    Logger.log({message: 'Displaying the loading screen', type: 'INFO'});
    WebView.currentPanel!.getWebview()?.reveal();
};

const stateMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDMAWBLATgFQPa4BtYA6dAO3QBd0BDA9ALzAGIBhAeQDkA1AUQCVsAbQAMAXUSgADrlhV0uMpJAAPRACYAnJuIBmdVoAsWgKwAOAOz6ANCACeiALS6dht290n9FgIzGfAL4BtmhYeIQkADK4NBDkUMwQimCkZABuuADWKQDGimlgmJSiEkggMnLUispqCIY+xOpmuj4WAGzGIiYW7W22DnU+6sRmZpq6loYtJl5eQSEYOPhExNGx8cyFmLiYxFIENJTIOwC2xHnphcXiyhXy1WW1PpoixL0GIqMiul2a-YgeRrqHxmdT1CxmNoWETfeYgUJLCLEAAi6Fg+xodnYAFdKFJcWwuHxBCVbrJ7kpHhozCNmjMzD42m0RBYpmZ-ghXhZxr4RENmR02iYtHCEeEVrxMNtMMx+LxsPwAJqksp3KqU0C1XRQkbmNqaNotVoWEyGDmmtrENqtJkmTQ+brawLBeGLcUkSXSwk8ATCG6q8nqmpORkWYiMgyabntEQdMwmDnPYaWETaCYTESGVkWIIusi4CBwZRi5bwAOVBQa1ROYEmcNtSPRgWGeMcxz8kZNIYsg0pjqit2l1LyOiMMBkisPTWIXQWZM+TyxmY+HwidTtRNC4gmb6Zj4G1dmAdhIdrOJkKATinBuqGN5QncrrMM-Ts+yIZ4NFc95kTVcOnMXRLJFUXRA4sVxfFKCvIMqQQdtDDrNpQSaYV1B+LwWTbFw3lBTRISzdo51GY9EQlKUdhgysb3bHDU0MFl40+MFgTfAZzC5XQ3CGLx1C8TR1FzAIgA */
    id: 'fhirTools',
    initial: 'initialize',
    predictableActionArguments: true,
    schema:{
        context: {} as StateMachineContext
    },
    context: {
        inputData: undefined,
        convType: undefined
    },
    states: {
        initialize: {
            on:{
                CONVERT:{
                    target: 'Loading',
                    actions: assignInputData
                }
            }
        },

        Loading:{
            entry: displayLoading,
            invoke:{
                id: 'convert',
                src: convert, 
                onDone:{
                    target: 'DisplayOutput',
                    actions: assign({
                        outputData: (context, event) => event.data.outputData
                    })
                },
                onError:{
                    target: 'Error',
                    actions: assign({
                        error: (context, event) => event.data.error
                    })
                }
            }
        },

        DisplayOutput:{
            entry: dispalyOutput,
            on:{
                CONVERT:{
                    target: 'Loading',
                    actions: assignInputData
                }
            }
        },

        Error:{
            entry: displayError,
            on:{
                RETRY:{
                    target: 'Loading',
                    actions: assign({
                        inputData: (context, event) => readFileSync(context.filePath, 'utf8')
                    })
                }, 
                CONVERT:{
                    target: 'Loading',
                    actions: assignInputData
                }
            }
        }
    }
});

let service = interpret(stateMachine);
service.start();

export function getService(){
    return service;
}

export function convertToFHIR(inputData: string, convType: string, filePath: string){
    service.send({type: 'CONVERT', inputData, convType, filePath});
}

export function retryConversion(){
    service.send({type: 'RETRY'});
}
