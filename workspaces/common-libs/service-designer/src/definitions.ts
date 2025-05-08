/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodePosition, Diagnostic } from "@wso2-enterprise/syntax-tree";
import { Item } from "@wso2-enterprise/ui-toolkit";

export interface ResponseConfig {
    id: number;
    code?: number | string;
    type?: string;
    isTypeArray?: boolean;
    source?: string;
    isNew?: boolean;
    defaultCode?: number;
    namedRecord?: string;
    description?: string;
}

export enum PARAM_TYPES {
    DEFAULT = 'Query',
    PARAM = 'Param',
    PAYLOAD = 'Payload',
    REQUEST = 'Request',
    CALLER = 'Caller',
    HEADER = 'Header',
}

export interface ParameterConfig {
    id: number;
    name: string;
    type?: string;
    option?: PARAM_TYPES;
    defaultValue?: string;
    isRequired?: boolean;
    isNew?: boolean;
}

export interface ServiceData {
    path: string;
    port: number;
    listener?: string;
}

export interface Resource {
    methods: string[];
    errors?: Diagnostic[];
    path: string;
    pathSegments?: ParameterConfig[];
    params?: ParameterConfig[];
    advancedParams?: Map<string, ParameterConfig>;
    payloadConfig?: ParameterConfig;
    responses?: ResponseConfig[];
    expandable?: boolean;
    isOpen?: boolean;
    updatePosition?: NodePosition; // Insert or Edit position of the resource
    position?: NodePosition; // Actual position of the resource which is used to render the resource
    addtionalInfo?: JSX.Element; // Addtional information to be displayed in the resource expanded view
    additionalActions?: Item[]; // Additional actions for the resource
}

export interface PathConfig {
    path: string;
    resources: ParameterConfig[];
}

export interface Service {
    path: string;
    port?: number;
    listener?: string;
    serviceType?: string;
    resources: Resource[];
    position?: NodePosition;
    triggerModel?: any;
}
