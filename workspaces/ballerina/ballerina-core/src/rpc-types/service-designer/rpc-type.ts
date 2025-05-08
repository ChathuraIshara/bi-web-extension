/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import { ListenerModelRequest, ListenerModelResponse, ServiceModelRequest, ServiceModelResponse, ServiceModelFromCodeRequest, ServiceModelFromCodeResponse, HttpResourceModelRequest, HttpResourceModelResponse, FunctionSourceCodeRequest, ListenerSourceCodeRequest, ListenersRequest, ListenersResponse, ServiceSourceCodeRequest, ListenerModelFromCodeRequest, ListenerModelFromCodeResponse, TriggerModelsRequest, TriggerModelsResponse, FunctionModelRequest, FunctionModelResponse } from "../../interfaces/extended-lang-client";
import {
    ExportOASRequest,
    ExportOASResponse,
    SourceUpdateResponse,
} from "./interfaces";
import { RequestType } from "vscode-messenger-common";

const _preFix = "service-designer";
export const exportOASFile: RequestType<ExportOASRequest, ExportOASResponse> = { method: `${_preFix}/exportOASFile` };
export const getTriggerModels: RequestType<TriggerModelsRequest, TriggerModelsResponse> = { method: `${_preFix}/getTriggerModels` };
export const getListeners: RequestType<ListenersRequest, ListenersResponse> = { method: `${_preFix}/getListeners` };
export const getListenerModel: RequestType<ListenerModelRequest, ListenerModelResponse> = { method: `${_preFix}/getListenerModel` };
export const addListenerSourceCode: RequestType<ListenerSourceCodeRequest, SourceUpdateResponse> = { method: `${_preFix}/addListenerSourceCode` };
export const updateListenerSourceCode: RequestType<ListenerSourceCodeRequest, SourceUpdateResponse> = { method: `${_preFix}/updateListenerSourceCode` };
export const getListenerModelFromCode: RequestType<ListenerModelFromCodeRequest, ListenerModelFromCodeResponse> = { method: `${_preFix}/getListenerModelFromCode` };
export const getServiceModel: RequestType<ServiceModelRequest, ServiceModelResponse> = { method: `${_preFix}/getServiceModel` };
export const getFunctionModel: RequestType<FunctionModelRequest, FunctionModelResponse> = { method: `${_preFix}/getFunctionModel` };
export const addServiceSourceCode: RequestType<ServiceSourceCodeRequest, SourceUpdateResponse> = { method: `${_preFix}/addServiceSourceCode` };
export const updateServiceSourceCode: RequestType<ServiceSourceCodeRequest, SourceUpdateResponse> = { method: `${_preFix}/updateServiceSourceCode` };
export const getServiceModelFromCode: RequestType<ServiceModelFromCodeRequest, ServiceModelFromCodeResponse> = { method: `${_preFix}/getServiceModelFromCode` };
export const getHttpResourceModel: RequestType<HttpResourceModelRequest, HttpResourceModelResponse> = { method: `${_preFix}/getHttpResourceModel` };
export const addResourceSourceCode: RequestType<FunctionSourceCodeRequest, SourceUpdateResponse> = { method: `${_preFix}/addResourceSourceCode` };
export const addFunctionSourceCode: RequestType<FunctionSourceCodeRequest, SourceUpdateResponse> = { method: `${_preFix}/addFunctionSourceCode` };
export const updateResourceSourceCode: RequestType<FunctionSourceCodeRequest, SourceUpdateResponse> = { method: `${_preFix}/updateResourceSourceCode` };
