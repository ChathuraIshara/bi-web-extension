/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { LineRange } from "./common";

// Component Diagram Model
export type CDModel = {
    automation?: CDAutomation;
    connections: CDConnection[];
    listeners: CDListener[];
    services: CDService[];
};

export type CDAutomation = {
    name: string;
    displayName: string;
    location: CDLocation;
    connections: string[];
    uuid: string;
};

export type CDLocation = LineRange & {
    filePath: string;
};

export type CDConnection = {
    symbol: string;
    location: CDLocation;
    scope: string;
    uuid: string;
    enableFlowModel: boolean;
    sortText: string;
    icon?: string;
};

export type CDListener = {
    symbol: string;
    location: CDLocation;
    attachedServices: string[];
    kind: string;
    type: string;
    args: CDArg[];
    uuid: string;
    icon: string;
    enableFlowModel: boolean;
    sortText: string;
};

export type CDArg = {
    key: string;
    value: string;
};

export type CDService = {
    location: CDLocation;
    attachedListeners: string[];
    connections: string[];
    functions: CDFunction[];
    remoteFunctions: CDFunction[];
    resourceFunctions: CDResourceFunction[];
    absolutePath: string;
    type: string;
    icon: string;
    uuid: string;
    enableFlowModel: boolean;
    sortText: string;
    displayName?: string;
};

export type CDFunction = {
    name: string;
    location: CDLocation;
    connections?: string[];
};

export type CDResourceFunction = {
    accessor: string;
    path: string;
    location: CDLocation;
    connections?: string[];
};
