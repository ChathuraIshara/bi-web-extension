/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface GraphqlDesignModel {
    graphqlService: Service;
    records: Map<string, RecordComponent>;
    serviceClasses: Map<string, ServiceClassComponent>;
    enums: Map<string, EnumComponent>;
    unions: Map<string, UnionComponent>;
    interfaces: Map<string, InterfaceComponent>;
    hierarchicalResources : Map<string, HierarchicalResourceComponent>;
}

export interface Service {
    serviceName: string;
    position: Position;
    description: string;
    resourceFunctions: ResourceFunction[];
    remoteFunctions: RemoteFunction[];
}

export interface RecordComponent {
    name: string;
    position: Position;
    description: string;
    recordFields: RecordField[];
    isInputObject: boolean;
}

export interface ServiceClassComponent {
    serviceName: string;
    position: Position;
    description: string;
    functions: ServiceClassField[];
}

export interface EnumComponent {
    name: string;
    position: Position;
    description: string;
    enumFields: EnumField[];
}

export interface UnionComponent {
    name: string;
    position: Position;
    description: string;
    possibleTypes: Interaction[];
}

export interface InterfaceComponent {
    name: string;
    position: Position;
    description: string;
    possibleTypes: Interaction[];
    resourceFunctions: ResourceFunction[];
}

export interface HierarchicalResourceComponent {
    name: string;
    hierarchicalResources: ResourceFunction[];
}

export interface Position {
    filePath: string;
    startLine: LinePosition;
    endLine: LinePosition;
}

interface LinePosition {
    line: number;
    offset: number;
}

export interface ResourceFunction {
    identifier: string;
    subscription: boolean;
    returns: string;
    position: Position;
    description: string;
    isDeprecated: boolean;
    deprecationReason: string;
    parameters: Param[];
    interactions: Interaction[];
}

export interface RemoteFunction {
    identifier: string;
    returns: string;
    position: Position;
    description: string;
    isDeprecated: boolean;
    deprecationReason: string;
    parameters: Param[];
    interactions: Interaction[];
}

export interface RecordField {
    name: string;
    type: string;
    defaultValue: string;
    description: string;
    isDeprecated: boolean;
    deprecationReason: string;
    interactions: Interaction[];
}

export interface ServiceClassField {
    identifier: string;
    returnType: string;
    description: string;
    isDeprecated: boolean;
    deprecationReason: string;
    parameters: Param[];
    interactions: Interaction[];
}

export interface EnumField {
    name: string;
    description: string;
    isDeprecated: boolean;
    deprecationReason: string;
}

export interface Param {
    type: string;
    name: string;
    description: string;
    defaultValue: string;
}

export interface Interaction {
    componentName: string;
    path: string;
}

// enums

export enum FunctionType {
    QUERY = "Query",
    MUTATION = "Mutation",
    SUBSCRIPTION = "Subscription",
    CLASS_RESOURCE = "ClassResource"
}

