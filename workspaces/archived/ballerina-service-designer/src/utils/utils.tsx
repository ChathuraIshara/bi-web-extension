/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonRPCAPI, DIAGNOSTIC_SEVERITY, DiagramDiagnostic, LineRange, responseCodes, ServiceDesignerAPI, STModification, TriggerFunction, TriggerNode, TriggerWizardAPI } from '@wso2-enterprise/ballerina-core';
import { DocumentIdentifier } from '@wso2-enterprise/ballerina-core';
import { BallerinaRpcClient } from '@wso2-enterprise/ballerina-rpc-client';
import * as Handlebars from 'handlebars';
import { Annotation, NodePosition, ObjectMethodDefinition, OptionalTypeDesc, RecordTypeDesc, ResourceAccessorDefinition, ServiceDeclaration, SimpleNameReference, STKindChecker } from "@wso2-enterprise/syntax-tree";
import { URI } from 'vscode-uri';
import { OptionProps } from '@wso2-enterprise/ui-toolkit';
import { PARAM_TYPES, ParameterConfig, PathConfig, Resource, ResponseConfig, ServiceData, Service } from './definitions';

export interface RPCClients {
    serviceDesignerRpcClient: ServiceDesignerAPI;
    triggerWizardRpcClient: TriggerWizardAPI;
    commonRpcClient: CommonRPCAPI;
}

export interface ResourceDefinition {
    METHOD: string;
    PATH: string;
    PARAMETERS: string;
    ADD_RETURN?: string;
}

export interface ServiceDefinition {
    BASE_PATH: string;
    SERVICE_TYPE: string;
    PORT: string;
}

export enum HTTP_METHOD {
    "GET" = "GET",
    "PUT" = "PUT",
    "POST" = "POST",
    "DELETE" = "DELETE",
    "PATCH" = "PATCH"
}

export function generateNewResourceFunction(data: ResourceDefinition): string {
    // Your Handlebars template
    const templateString = `resource function {{{ METHOD }}} {{{ PATH }}} ( {{{ PARAMETERS }}} ) returns {{#if ADD_RETURN}}{{{ADD_RETURN}}}|{{/if}}http:InternalServerError  {do {} on fail error e { return http:INTERNAL_SERVER_ERROR; }}`;
    // Compile the template
    const compiledTemplate = Handlebars.compile(templateString);
    // Apply data to the template
    const resultString = compiledTemplate(data);
    return resultString;
}

export function updateResourceFunction(data: ResourceDefinition): string {
    // Your Handlebars template
    const templateString = `{{{ METHOD }}} {{{ PATH }}}({{{ PARAMETERS }}}) {{#if ADD_RETURN}}returns {{{ADD_RETURN}}} {{/if}}`;
    // Compile the template
    const compiledTemplate = Handlebars.compile(templateString);
    // Apply data to the template
    const resultString = compiledTemplate(data);
    return resultString;
}

export function updateServiceDecl(data: ServiceDefinition): string {
    // Your Handlebars template
    const templateString = `service {{{ BASE_PATH }}} on new {{{ SERVICE_TYPE }}}:Listener({{{ PORT }}})`;
    // Compile the template
    const compiledTemplate = Handlebars.compile(templateString);
    // Apply data to the template
    const resultString = compiledTemplate(data);
    return resultString;
}

export function getModification(code: string, targetPosition: NodePosition): STModification {
    return {
        type: "INSERT",
        isImport: false,
        config: {
            "STATEMENT": code
        },
        ...targetPosition
    };
}

export async function getServiceST(documentIdentifier: DocumentIdentifier,
    rpcClient: BallerinaRpcClient, position: NodePosition): Promise<ServiceDeclaration> {
    const response = await rpcClient.getLangClientRpcClient().getSTByRange({
        lineRange: {
            start: {
                line: position.startLine,
                character: position.startColumn
            },
            end: {
                line: position.endLine,
                character: position.endColumn
            }
        },
        documentIdentifier: {
            uri: URI.file(documentIdentifier.uri).toString()
        }
    });
    if (!response.syntaxTree || !STKindChecker.isServiceDeclaration(response.syntaxTree)) {
        throw new Error("Service Syntax tree not found");
    } else {
        return response.syntaxTree;
    }
}

export function getDefaultResponse(httpMethod: HTTP_METHOD): number {
    switch (httpMethod.toUpperCase()) {
        case HTTP_METHOD.GET:
            return 200;
        case HTTP_METHOD.PUT:
            return 200;
        case HTTP_METHOD.POST:
            return 201;
        case HTTP_METHOD.DELETE:
            return 200;
        case HTTP_METHOD.PATCH:
            return 200;
        default:
            return 200;
    }
}

export function getCodeFromResponse(response: string, httpMethod: HTTP_METHOD): number {
    const code = responseCodes.find((responseCode) => responseCode.source.toLowerCase() === response?.toLowerCase());
    return code?.code || getDefaultResponse(httpMethod);
}

export function findResponseCodeByRecordSource(recordSource: string, httpMethod: HTTP_METHOD): number {
    const code = responseCodes.find((responseCode) => recordSource?.includes(responseCode.source));
    return code?.code || getDefaultResponse(httpMethod);
}

export function getCodeFromSource(response: string, httpMethod: HTTP_METHOD): number {
    const code = responseCodes.find((responseCode) => responseCode.source === response);
    return code?.code || getDefaultResponse(httpMethod);
}

export function getTitleFromResponseCode(code: number): string {
    const response = responseCodes.find((response) => response.code === code);
    return response ? response.title : "";
}

export function getSourceFromResponseCode(code: number): string {
    const response = responseCodes.find((response) => response.code === code);
    return response ? response.source : "";
}

export function getResponseRecordCode(code: number, type: string): string {
    const genCode = `record {|*${getSourceFromResponseCode(code)}; ${type} body;|}`;
    return genCode;
}

export function getResponseRecordDefCode(name: string, code: number, type: string): string {
    const genCode = `type ${name} record {|*${getSourceFromResponseCode(code)}; ${type} body;|};`;
    return genCode;
}

export function getParamType(typeName: string): PARAM_TYPES {
    switch (typeName) {
        case "http:Headers":
        case "@http:Header":
            return PARAM_TYPES.HEADER;
        case "http:Request":
            return PARAM_TYPES.REQUEST;
        case "http:Caller":
            return PARAM_TYPES.CALLER;
        case "@http:Payload":
            return PARAM_TYPES.PAYLOAD;
        default:
            return PARAM_TYPES.DEFAULT;
    }
}

export function isAdvancedParam(type: string): boolean {
    return type === "http:Caller" || type === "http:Request" || type === "http:Headers";
}

export function isPayloadParam(annotations: Annotation[]): boolean {
    return annotations?.some((annotation) => annotation?.source.trim() === "@http:Payload");
}

export function isHeaderParam(annotations: Annotation[]): boolean {
    return annotations?.some((annotation) => annotation?.source.trim() === "@http:Header");
}

export const getRecordSource = async (recordName: string, rpcClient: RPCClients): Promise<string> => {
    const response = await rpcClient?.serviceDesignerRpcClient.getRecordST({ recordName: recordName });
    return response?.recordST.source;
};

export const getNameRecordType = async (recordName: string, rpcClient: RPCClients): Promise<string> => {
    let namedRecordType = "";
    const response = await rpcClient?.serviceDesignerRpcClient.getRecordST({ recordName: recordName });
    if (response && STKindChecker.isRecordTypeDesc(response.recordST?.typeDescriptor)) {
        const record = response.recordST.typeDescriptor as RecordTypeDesc;
        record.fields.forEach(field => {
            if (STKindChecker.isRecordField(field) && field.fieldName.value === "body") {
                namedRecordType = (field.typeName as SimpleNameReference).name.value;
            }
        })
    }
    return namedRecordType;
};

export const getServiceData = async (service: ServiceDeclaration, rpcClient: RPCClients, serviceFilePath: string): Promise<Service> => {
    let serviceData: ServiceData | Service;
    // Get the listener expression information
    if (service && service?.expressions.length > 0) {
        const expression = service?.expressions[0];

        // If the listener is in-line
        if (STKindChecker.isExplicitNewExpression(expression)) {// If the listener is in-line
            if (
                STKindChecker.isQualifiedNameReference(
                    expression.typeDescriptor
                )
            ) {
                const port = expression.parenthesizedArgList?.arguments[0]?.source.trim();
                serviceData = {
                    port: isNaN(Number(port)) ? null : Number(port),
                    path: "",
                    listener: port
                };
            }
        } else if (STKindChecker.isSimpleNameReference(expression)) {// If the listener a reference
            serviceData = {
                port: null,
                path: "",
                listener: expression.name.value
            };
        }
    }

    // Get trigger model if available
    const position: NodePosition = service.position;
    const range: LineRange = { startLine: { line: position.startLine, offset: position.startColumn }, endLine: { line: position.endLine, offset: position.endColumn } };
    const triggerResponse = await rpcClient.serviceDesignerRpcClient.getServiceModelFromCode({ filePath: serviceFilePath, codedata: { lineRange: range } });
    if (triggerResponse?.service) {
        serviceData = {
            ...serviceData,
            serviceType: triggerResponse.service.displayName,
            triggerModel: triggerResponse.service,
        };
    }


    // Get the service path information
    // If the path is inline
    if (service && service.absoluteResourcePath.length > 0) {
        let absolutePath = "";
        service.absoluteResourcePath?.forEach((path) => {
            absolutePath += path.value;
        });
        serviceData = {
            ...serviceData,
            path: absolutePath
        };
    }
    // If the path is type reference
    if (service?.typeDescriptor && STKindChecker.isQualifiedNameReference(service.typeDescriptor)) {
        const absolutePath = service?.typeDescriptor.source.trim();
        serviceData = {
            ...serviceData,
            path: absolutePath
        };

        // // Check for trigger type
        // const typeData = service.typeDescriptor.typeData;
        // if (typeData.symbol) {
        //     const orgName = typeData.symbol.moduleID.orgName;
        //     const packageName = typeData.symbol.moduleID.moduleName;
        //     const triggerResponse = await rpcClient.triggerWizardRpcClient.getTrigger({ orgName, packageName });
        //     const serviceType = triggerResponse.serviceTypes.find(res =>
        //         absolutePath.toLowerCase().includes(res.name.toLowerCase())
        //     )
        //     serviceData = {
        //         ...serviceData,
        //         serviceType: triggerResponse.displayName,
        //         triggerModel: serviceType,
        //     };
        // }

    }
    console.log("XXX serviceData", serviceData);
    return serviceData as Service;
}

export async function getResource(resource: ResourceAccessorDefinition, rpcClient: RPCClients, isBI?: boolean): Promise<Resource> {
    const pathConfig = getResourcePath(resource);
    const queryParams: ParameterConfig[] = getQueryParams(resource);
    const payloadConfig: ParameterConfig = getPayloadConfig(resource);
    const advanceParams: Map<string, ParameterConfig> = getAdvancedParams(resource);
    const response: ResponseConfig[] = await getResponseConfig(resource, rpcClient);
    const position = {
        startLine: resource?.functionName?.position?.startLine,
        startColumn: resource?.functionName?.position?.startColumn,
        endLine: resource?.functionSignature?.position?.endLine,
        endColumn: resource?.functionSignature?.position?.endColumn
    };
    const errors = resource.typeData?.diagnostics.filter((diag: DiagramDiagnostic) => diag.diagnosticInfo.severity === DIAGNOSTIC_SEVERITY.ERROR);
    return {
        methods: [resource.functionName.value],
        path: pathConfig.path,
        pathSegments: pathConfig.resources,
        params: queryParams,
        advancedParams: advanceParams,
        payloadConfig: payloadConfig,
        responses: response,
        updatePosition: position,
        position: resource.position,
        errors: errors,
        expandable: isBI ? false : true
    };
}

export async function getFunction(resource: ObjectMethodDefinition, rpcClient: RPCClients, isBI?: boolean): Promise<Resource> {
    const pathConfig = resource.functionName.value;
    const queryParams: ParameterConfig[] = getQueryParams(resource);
    const payloadConfig: ParameterConfig = null;
    const advanceParams: Map<string, ParameterConfig> = null;
    const response: ResponseConfig[] = await getReturnConfig(resource, rpcClient);
    const position = {
        ...resource.position
    };
    const errors = resource.typeData?.diagnostics.filter((diag: DiagramDiagnostic) => diag.diagnosticInfo.severity === DIAGNOSTIC_SEVERITY.ERROR);
    return {
        methods: ["remote"],
        path: pathConfig,
        pathSegments: [],
        params: queryParams,
        advancedParams: advanceParams,
        payloadConfig: payloadConfig,
        responses: response,
        updatePosition: position,
        position: resource.position,
        errors: errors,
        expandable: isBI ? false : true
    };
}

export function getServicePosition(service: ServiceDeclaration): NodePosition {
    const serviceKeywordPosition = service.serviceKeyword?.position;
    const serviceExpressionPosition = service.expressions[0]?.position;
    return {
        startLine: serviceKeywordPosition.startLine,
        startColumn: serviceKeywordPosition.startColumn,
        endLine: serviceExpressionPosition.endLine,
        endColumn: serviceExpressionPosition.endColumn
    };
}

export async function getService(serviceDecl: ServiceDeclaration, rpcClient: RPCClients, isBI: boolean, handleResourceEdit: (resource: Resource) => Promise<void>, handleResourceDelete: (resource: Resource) => Promise<void>, serviceFilePath: string): Promise<Service> {
    const serviceData: Service = await getServiceData(serviceDecl, rpcClient, serviceFilePath);
    // let canEdit = true;
    // if (serviceDecl?.typeDescriptor && STKindChecker.isSimpleNameReference(serviceDecl.typeDescriptor)) {
    //     canEdit = false;
    // }
    const resources: Resource[] = [];
    for (const member of serviceDecl.members) {
        if (STKindChecker.isResourceAccessorDefinition(member)) {
            const resource = await getResource(member, rpcClient, isBI);
            // If we want to add more actions to the resource menu do following
            //const editAction: Item = {
            //     id: "edit",
            //     label: "Edit",
            //     onClick: () => handleResourceEdit(resource),
            // };
            // const deleteAction: Item = {
            //     id: "delete",
            //     label: "Delete",
            //     onClick: () => handleResourceDelete(resource),
            // };
            // const moreActions: Item[] = [editAction, deleteAction];
            // if (canEdit) {
            //     resource.additionalActions = moreActions;
            // }
            resources.push(resource);
        }
        if (serviceData.triggerModel && serviceData.triggerModel.moduleName !== "http" && STKindChecker.isObjectMethodDefinition(member)) {
            const resource = await getFunction(member, rpcClient, isBI);
            // const editAction: Item = {
            //     id: "edit",
            //     label: "Edit",
            //     onClick: () => handleResourceEdit(resource),
            // };
            // const deleteAction: Item = {
            //     id: "delete",
            //     label: "Delete",
            //     onClick: () => handleResourceDelete(resource),
            // };
            // const moreActions: Item[] = [editAction, deleteAction];
            // if (canEdit) {
            //     resource.additionalActions = moreActions;
            // }
            resources.push(resource);
        }
    }
    console.log("XXX", serviceData);
    return {
        ...serviceData,
        resources: resources,
        position: getServicePosition(serviceDecl)
    }
}

async function findResponseType(typeSymbol: any, resource: any, index: any, rpcClient: RPCClients, members: any) {
    let type = "";
    const isArray = typeSymbol.typeKind === "array";
    typeSymbol = isArray && typeSymbol.memberTypeDescriptor ? typeSymbol.memberTypeDescriptor : typeSymbol;
    if (typeSymbol.typeKind === "record") {
        return getInlineRecordConfig(resource, index, typeSymbol);
    } else if (typeSymbol.typeKind === "typeReference" && !typeSymbol.signature?.includes("ballerina")) {
        const recordST: string = await getRecordSource(typeSymbol.name, rpcClient);
        const bodyType: string = await getNameRecordType(typeSymbol.name, rpcClient);
        type = (members && members[index + 1]?.typeKind === "nil") ? typeSymbol.name + "?" : typeSymbol.name;
        return {
            id: index,
            code: findResponseCodeByRecordSource(recordST, resource.functionName.value as HTTP_METHOD),
            type: bodyType || type,
            isTypeArray: isArray,
            source: isArray ? `${type}[]` : type,
            namedRecord: bodyType ? type : null
        };
    } else if (typeSymbol.typeKind === "typeReference" && typeSymbol.signature?.includes("ballerina")) {
        const name = typeSymbol.moduleID?.moduleName === "http" ? `http:${typeSymbol.name}` : typeSymbol.name;
        return {
            id: index,
            code: getCodeFromResponse(name, resource.functionName.value as HTTP_METHOD),
            type: "",
            source: isArray ? `${name}[]` : name,
            isTypeArray: isArray,
        };
    } else if (typeSymbol.typeKind !== "nil") {
        type = (members && members[index + 1]?.typeKind === "nil") ? typeSymbol.typeKind + "?" : typeSymbol.typeKind;
        return {
            id: index,
            code: ((type === "error" || type === "error?") ? 500 : getCodeFromResponse(typeSymbol.name as string, resource.functionName.value as HTTP_METHOD)),
            type: type,
            source: isArray ? `${type}[]` : type,
            isTypeArray: isArray
        };
    }
}

async function findFunctionType(typeSymbol: any, resource: any, index: any, rpcClient: RPCClients, members: any) {
    let type = "";
    const isArray = typeSymbol.typeKind === "array";
    typeSymbol = isArray && typeSymbol.memberTypeDescriptor ? typeSymbol.memberTypeDescriptor : typeSymbol;
    if (typeSymbol.typeKind === "record") {
        return getInlineRecordConfig(resource, index, typeSymbol);
    } else if (typeSymbol.typeKind === "typeReference" && !typeSymbol.signature?.includes("ballerina")) {
        const bodyType: string = await getNameRecordType(typeSymbol.name, rpcClient);
        type = (members && members[index + 1]?.typeKind === "nil") ? typeSymbol.name + "?" : typeSymbol.name;
        return {
            id: index,
            type: bodyType || type,
            isTypeArray: isArray,
            source: isArray ? `${type}[]` : type
        };
    } else if (typeSymbol.typeKind === "typeReference" && typeSymbol.signature?.includes("ballerina")) {
        const name = typeSymbol.moduleID?.moduleName === "http" ? `http:${typeSymbol.name}` : typeSymbol.name;
        return {
            id: index,
            type: "",
            source: isArray ? `${name}[]` : name,
            isTypeArray: isArray,
        };
    } else if (typeSymbol.typeKind !== "nil") {
        type = (members && members[index + 1]?.typeKind === "nil") ? typeSymbol.typeKind + "?" : typeSymbol.typeKind;
        if (typeSymbol.signature.includes("error")) {
            type = typeSymbol.signature
        }
        return {
            id: index,
            type: type,
            source: isArray ? `${type}[]` : type,
            isTypeArray: isArray
        };
    }
}

export async function getResponseConfig(resource: ResourceAccessorDefinition, rpcClient: RPCClients): Promise<ResponseConfig[]> {
    let index = 0;
    const response: ResponseConfig[] = [];
    const members = resource?.functionSignature?.returnTypeDesc?.type?.typeData?.typeSymbol?.members;
    if (resource?.functionSignature?.returnTypeDesc?.type?.typeData?.typeSymbol?.typeKind === "union" && members) {
        for (const member of members) {
            const res = await findResponseType(member, resource, index, rpcClient, members);
            res && response.push(res) && index++;
        }
    } else if (resource?.functionSignature?.returnTypeDesc?.type?.typeData?.typeSymbol) {
        const typeSymbol = resource?.functionSignature?.returnTypeDesc?.type?.typeData?.typeSymbol;
        const res = await findResponseType(typeSymbol, resource, index, rpcClient, members);
        response.push(res);
    }
    return response;
}

export async function getReturnConfig(resource: ResourceAccessorDefinition, rpcClient: RPCClients): Promise<ResponseConfig[]> {
    let index = 0;
    const response: ResponseConfig[] = [];
    const members = resource?.functionSignature?.returnTypeDesc?.type?.typeData?.typeSymbol?.members.find((res: any) => res.typeKind !== "nil");
    if (resource?.functionSignature?.returnTypeDesc?.type?.typeData?.typeSymbol?.typeKind === "union" && Array.isArray(members)) {
        for (const member of members) {
            const res = await findFunctionType(member, resource, index, rpcClient, members);
            res && response.push(res) && index++;
        }
    } else if (resource?.functionSignature?.returnTypeDesc?.type?.typeData?.typeSymbol) {
        const typeSymbol = resource?.functionSignature?.returnTypeDesc?.type?.typeData?.typeSymbol;
        const res = await findFunctionType(typeSymbol, resource, index, rpcClient, members);
        response.push(res);
    }
    return response;
}

export function getInlineRecordConfig(resource: ResourceAccessorDefinition, index: number, member: any): ResponseConfig {
    const statusRegex = /readonly\s+ballerina\/http:[\d.]+:(\w+)\s+status;/;
    const statusMatch = member.signature.match(statusRegex);
    const status = statusMatch ? statusMatch[1] : "";
    const subTypeRegex = /\b(\w+)\s+body;/;
    const subTypeMatch = member.signature.match(subTypeRegex);
    const subtype = subTypeMatch ? subTypeMatch[1] : "";
    return ({
        id: index,
        code: getCodeFromResponse(`http:${status.replace("Status", "")}`, resource.functionName.value as HTTP_METHOD),
        source: getResponseRecordCode(getCodeFromResponse(`http:${status.replace("Status", "")}`, resource.functionName.value as HTTP_METHOD), subtype),
        type: subtype
    });
}

export function getResourcePath(resource: ResourceAccessorDefinition): PathConfig {
    let resourcePath = "";
    const pathParams: ParameterConfig[] = [];
    // Collect path segments
    resource.relativeResourcePath?.forEach((path, index) => {
        if (STKindChecker.isResourcePathSegmentParam(path)) {
            pathParams.push({
                id: index,
                name: path?.paramName?.value,
                type: path?.typeDescriptor?.source?.trim(),
            });
        }
        resourcePath += STKindChecker.isResourcePathSegmentParam(path) ? path.source : path?.value;
    });
    return { path: resourcePath, resources: pathParams };
}

export function getQueryParams(resource: ResourceAccessorDefinition | ObjectMethodDefinition): ParameterConfig[] {
    const queryParams: ParameterConfig[] = [];
    let index = 0;
    resource.functionSignature?.parameters?.forEach((queryParam) => {
        if (!STKindChecker.isCommaToken(queryParam) && !(isAdvancedParam(queryParam?.typeName?.source?.trim())) && !(isPayloadParam(queryParam?.annotations))) {
            queryParams.push({
                id: index,
                name: queryParam?.paramName?.value,
                type: STKindChecker.isOptionalTypeDesc(queryParam?.typeName) ? (queryParam?.typeName as OptionalTypeDesc).typeDescriptor?.source?.trim() : queryParam?.typeName?.source?.trim(),
                defaultValue: STKindChecker.isDefaultableParam(queryParam) && queryParam?.expression?.source?.trim() || "",
                option: isHeaderParam(queryParam?.annotations) ? getParamType("@http:Header") : getParamType(queryParam?.typeName?.source?.trim()),
                isRequired: !STKindChecker.isOptionalTypeDesc(queryParam?.typeName),
            });
            index++;
        }
    });
    return queryParams;
}

export function getPayloadConfig(resource: ResourceAccessorDefinition): ParameterConfig {
    let payloadConfig: ParameterConfig;
    resource.functionSignature?.parameters?.forEach((queryParam) => {
        if (!STKindChecker.isCommaToken(queryParam) && isPayloadParam(queryParam?.annotations)) {
            payloadConfig = {
                id: 0,
                name: queryParam?.paramName?.value,
                type: STKindChecker.isOptionalTypeDesc(queryParam?.typeName) ? (queryParam?.typeName as OptionalTypeDesc).typeDescriptor?.source?.trim() : queryParam?.typeName?.source?.trim(),
                defaultValue: STKindChecker.isDefaultableParam(queryParam) && queryParam?.expression?.source?.trim() || "",
                option: getParamType("@http:Payload"),
                isRequired: !STKindChecker.isOptionalTypeDesc(queryParam?.typeName),
            };
        }
    });
    return payloadConfig;
}

export function getAdvancedParams(resource: ResourceAccessorDefinition): Map<string, ParameterConfig> {
    const advanceParams: Map<string, ParameterConfig> = new Map();
    resource.functionSignature?.parameters?.forEach((queryParam) => {
        if (!STKindChecker.isCommaToken(queryParam) && isAdvancedParam(queryParam?.typeName?.source?.trim())) {
            advanceParams.set(getParamType(queryParam?.typeName?.source?.trim()), {
                id: 0,
                name: queryParam?.paramName?.value,
                type: queryParam?.typeName?.source?.trim(),
                option: getParamType(queryParam?.typeName?.source?.trim()),
                isRequired: !STKindChecker.isOptionalTypeDesc(queryParam?.typeName),
            });
        }
    });
    return advanceParams;
}

export function removeStatement(targetPosition: NodePosition): STModification {
    const removeLine: STModification = {
        type: 'DELETE',
        ...targetPosition
    };

    return removeLine;
}


export interface TriggerFunctionProps {
    functionName: OptionProps;
    params: ParameterConfig[];
    return: ResponseConfig;
    functionNode: TriggerFunction;
}

export function getTriggerAvailableFunctions(triggerNode: TriggerNode, fetchAll?: boolean) {
    const funcProps: TriggerFunctionProps[] = [];
    triggerNode?.service.functions.forEach(func => {
        if (fetchAll || !func.enabled) {
            const params: ParameterConfig[] = [];
            func.parameters.forEach((param, index) => {
                if (!param.optional) {
                    params.push({
                        id: index,
                        type: param.type.value || param.type.placeholder,
                        name: param.name.placeholder,
                        isRequired: !param.optional
                    });
                }
            })
            funcProps.push({
                functionName: { value: func.name.value },
                params: params,
                return: { id: 0, type: func.returnType.valueTypeConstraint },
                functionNode: func
            })
        }
    })
    return funcProps;
}
