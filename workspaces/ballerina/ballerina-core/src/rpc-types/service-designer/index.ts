/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ListenerModelRequest, ListenerModelResponse, ServiceModelRequest, ServiceModelResponse, ServiceModelFromCodeRequest, ServiceModelFromCodeResponse, HttpResourceModelRequest, HttpResourceModelResponse, FunctionSourceCodeRequest, ListenerSourceCodeRequest, ListenersRequest, ListenersResponse, ServiceSourceCodeRequest, ListenerModelFromCodeRequest, ListenerModelFromCodeResponse, TriggerModelsRequest, TriggerModelsResponse, FunctionModelRequest, FunctionModelResponse } from "../../interfaces/extended-lang-client";
import {
    ExportOASRequest,
    ExportOASResponse,
    SourceUpdateResponse,
} from "./interfaces";

export interface ServiceDesignerAPI {
    exportOASFile: (params: ExportOASRequest) => Promise<ExportOASResponse>;
    getTriggerModels: (params: TriggerModelsRequest) => Promise<TriggerModelsResponse>;
    getListeners: (params: ListenersRequest) => Promise<ListenersResponse>;
    getListenerModel: (params: ListenerModelRequest) => Promise<ListenerModelResponse>;
    addListenerSourceCode: (params: ListenerSourceCodeRequest) => Promise<SourceUpdateResponse>;
    updateListenerSourceCode: (params: ListenerSourceCodeRequest) => Promise<SourceUpdateResponse>;
    getListenerModelFromCode: (params: ListenerModelFromCodeRequest) => Promise<ListenerModelFromCodeResponse>;
    getServiceModel: (params: ServiceModelRequest) => Promise<ServiceModelResponse>;
    getFunctionModel: (params: FunctionModelRequest) => Promise<FunctionModelResponse>;
    addServiceSourceCode: (params: ServiceSourceCodeRequest) => Promise<SourceUpdateResponse>;
    updateServiceSourceCode: (params: ServiceSourceCodeRequest) => Promise<SourceUpdateResponse>;
    getServiceModelFromCode: (params: ServiceModelFromCodeRequest) => Promise<ServiceModelFromCodeResponse>;
    getHttpResourceModel: (params: HttpResourceModelRequest) => Promise<HttpResourceModelResponse>;
    addResourceSourceCode: (params: FunctionSourceCodeRequest) => Promise<SourceUpdateResponse>;
    addFunctionSourceCode: (params: FunctionSourceCodeRequest) => Promise<SourceUpdateResponse>;
    updateResourceSourceCode: (params: FunctionSourceCodeRequest) => Promise<SourceUpdateResponse>;
}
