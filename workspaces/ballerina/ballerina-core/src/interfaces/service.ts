/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DisplayAnnotation } from "./ballerina";
import { DiagnosticMessage, Imports, PropertyTypeMemberInfo } from "./bi";
import { LineRange } from "./common";


export type ListenerModel = {
    id: number;
    displayAnnotation?: DisplayAnnotation;
    name: string;
    type: string;
    displayName: string;
    documentation: string;
    moduleName: string;
    orgName: string;
    version: string;
    packageName: string;
    listenerProtocol: string;
    icon: string;
    properties?: ConfigProperties;
};


export interface ServiceModel {
    id: number;
    name: string;
    type: string;
    displayName?: string;
    documentation?: string;
    moduleName: string;
    orgName: string;
    version: string;
    packageName: string;
    listenerProtocol: string;
    icon: string;
    properties?: ConfigProperties;
    functions?: FunctionModel[];
    displayAnnotation?: DisplayAnnotation;
    codedata?: CodeData;
}

export interface ServiceClassModel { // for Ballerina Service Classes
    id: number;
    name: string;
    type: string;
    properties?: ConfigProperties;
    functions?: FunctionModel[];
    displayAnnotation?: DisplayAnnotation;
    codedata?: CodeData;
    fields?: FieldType[];
}


export interface FieldType extends ParameterModel {
    codedata: CodeData;
    isPrivate: boolean;
    isFinal: boolean;
}

export interface FunctionModel {
    metadata?: MetaData;
    kind: "REMOTE" | "RESOURCE" | "QUERY" | "MUTATION" | "SUBSCRIPTION" | "DEFAULT" | "INIT";
    enabled: boolean;
    optional: boolean;
    editable: boolean;
    codedata?: CodeData;

    canAddParameters?: boolean;

    // accessor will be used by resource functions
    accessor?: PropertyModel;

    name: PropertyModel;
    parameters: ParameterModel[];
    schema?: ConfigProperties;
    returnType: ReturnTypeModel;
    qualifiers?: string[];
}


export interface ReturnTypeModel extends PropertyModel {
    responses?: StatusCodeResponse[];
    schema?: ConfigProperties;
}
export interface StatusCodeResponse extends PropertyModel {
    statusCode: PropertyModel;
    body: PropertyModel;
    name: PropertyModel;
    type: PropertyModel;
    headers: PropertyModel;
}

interface MetaData {
    label: string;
    description: string;
    groupNo?: number;
    groupName?: string;
}

interface CodeData {
    label?: string;
    description?: string;
    groupNo?: number;
    groupName?: string;
    lineRange?: LineRange;
    inListenerInit: boolean;
    isBasePath: boolean;
    inDisplayAnnotation: boolean;
    type?: string;
}

export interface PropertyModel {
    metadata?: MetaData;
    codedata?: CodeData;
    enabled?: boolean;
    editable?: boolean;
    isHttpResponseType?: boolean;
    value?: string;
    values?: string[];
    valueType?: string;
    valueTypeConstraint?: string;
    isType?: boolean;
    placeholder?: string;
    defaultValue?: string | PropertyModel;
    optional?: boolean;
    advanced?: boolean;
    items?: string[];
    choices?: PropertyModel[];
    properties?: ConfigProperties;
    addNewButton?: boolean;
    typeMembers?: PropertyTypeMemberInfo[];
    httpParamType?: "QUERY" | "Header" | "PAYLOAD";
    diagnostics?: DiagnosticMessage[];
    imports?: Imports;
}

export interface ParameterModel extends PropertyModel {
    kind?: "REQUIRED" | "OPTIONAL",
    type?: PropertyModel;
    name?: PropertyModel;
}


export interface ConfigProperties {
    [key: string]: PropertyModel | ParameterModel;
}
