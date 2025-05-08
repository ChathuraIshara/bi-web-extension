/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { URI } from "vscode-uri";

import { CompletionParams, CompletionResponse, ExpressionEditorLangClientInterface, PartialSTRequest, STModification } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { PARAM_TYPES } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import {
    CommaToken, DefaultableParam,
    DotToken,
    FunctionSignature, IdentifierToken, IncludedRecordParam,
    NodePosition, RequiredParam, ResourcePathRestParam, ResourcePathSegmentParam, RestParam,
    ReturnTypeDescriptor,
    SlashToken,
    STKindChecker,
    STNode
} from "@wso2-enterprise/syntax-tree";

import {
    AdvancedParams,
    Path,
    PathSegment,
    Payload,
    QueryParam,
    QueryParamCollection, ResourceDiagnostics,
    ReturnType,
    ReturnTypeCollection,
} from "./types";

export const headerParameterOption = "Header";
export const queryParameterOption = "Query";
export const paramOptions = [queryParameterOption, headerParameterOption];

export const payloadTypes: string[] = ["json", "xml", "byte[]", "string"];
export const queryParamTypes: string[] = ["string", "int"];
export const pathParamTypes: string[] = ["string", "int"];
export const returnTypes: string[] = ["http:Response", "json", "xml", "string", "int", "boolean", "float"];
export const functionParamTypes: string[] = ["json", "xml", "string", "int", "boolean", "float"];
export const functionReturnTypes: string[] = ["json", "xml", "string", "int", "boolean", "float", "error"];
export const HTTP_GET = "GET";
export const HTTP_POST = "POST";
export const HTTP_PUT = "PUT";
export const HTTP_DELETE = "DELETE";
export const HTTP_OPTIONS = "OPTIONS";
export const HTTP_HEAD = "HEAD";
export const HTTP_PATCH = "PATCH";

export const SERVICE_METHODS = [HTTP_GET, HTTP_PUT, HTTP_DELETE, HTTP_POST, HTTP_PATCH];

export const getPathOfResources = (resources: any[] = []) =>
    resources?.map((path: any) => path?.value || path?.source).join('');

export function getBallerinaPayloadType(payload: Payload, addComma?: boolean): string {
    return payload.type && payload.name && payload.type !== ""
        && payload.name !== "" ? ("@http:Payload " + payload.type + " " + payload.name + (addComma ? ", " : "")) : "";
}

export function getQueryParamCollection(queryParamString: string): QueryParamCollection {
    const queryParamCollection: QueryParamCollection = {
        queryParams: []
    };

    if (queryParamString && queryParamString !== "") {
        const queryParamSplited: string[] = queryParamString.trim().split(",");
        queryParamSplited.forEach((value, index) => {
            const matchedMappedName = value.trim().match(/{[a-zA-Z]+\s*:\s*"[a-zA-Z0-9]+"}/);
            const mappedName = matchedMappedName ? value.trim().match(/{[a-zA-Z]+\s*:\s*"[a-zA-Z0-9]+"}/)[0]
                : undefined;
            const equalsTokenSplit = value.trim().replace(/{[a-zA-Z]+\s*:\s*"[a-zA-Z0-9]+"}/, "").trim().split("=");
            const paramSplit: string[] = equalsTokenSplit[0].trim().split(/\s+/);
            const queryParam: QueryParam = {
                id: index,
                name: "",
                type: "",
                option: "",
                defaultValue: equalsTokenSplit[1] ? equalsTokenSplit[1] : undefined
            };
            if (mappedName) {
                // Header with default value
                queryParam.option = headerParameterOption;
                queryParam.type = paramSplit[1];
                queryParam.name = paramSplit[2];
                queryParam.mappedName = mappedName.replace("{", "")
                    .replace("}", "").split(":")[1].trim();
            } else if (paramSplit.length === 3) {
                if (paramSplit[0] === "@http:Header") {
                    // Headers without default value
                    queryParam.option = headerParameterOption;
                    queryParam.type = paramSplit[1];
                    const nameSplit = paramSplit[2].split(":");
                    queryParam.name = nameSplit[0];
                    queryParam.mappedName = nameSplit[1];
                } else {
                    // Query Param with default value
                    queryParam.option = queryParameterOption;
                    queryParam.type = paramSplit[0];
                    queryParam.name = paramSplit[1];
                    queryParam.defaultValue = paramSplit[2];
                }
            } else {
                // Query Param without default value
                queryParam.option = queryParameterOption;
                queryParam.type = paramSplit[0];
                queryParam.name = paramSplit[1];
            }
            queryParamCollection.queryParams.push(queryParam);
        });
    }

    return queryParamCollection;
}

/**
 *
 * @param pathString path will be like `/name/[string name]/id/[int id]`
 * @returns Path
 */
export function convertPathStringToSegments(pathString: string): Path {
    const path: Path = {
        segments: []
    };
    if (pathString && pathString !== "") {
        const pathSegments: string[] = pathString.split("/");
        pathSegments.forEach((value, index) => {
            let segment: PathSegment;
            if (value.startsWith("[") && value.endsWith("]")) {
                segment = convertPathParamStringToSegment(value.replace("[", "").replace("]", ""));
                segment.id = index;
            } else if (value.startsWith("{") && value.endsWith("}")) {
                segment = {
                    id: index,
                    isParam: true,
                    name: value.replace("{", "").replace("}", ""),
                    type: "string"
                };
            } else {
                segment = {
                    id: index,
                    isParam: false,
                    name: value
                }
            }

            if (value === "") {
                segment.isLastSlash = true;
            }

            path.segments.push(segment);
        });
    }
    return path;
}

// export function generatePathFromST(segments: (IdentifierToken | ResourcePathSegmentParam | SlashToken | DotToken
//     | ResourcePathRestParam)[]): string {
//     return segments.reduce((prev, current) => `${prev}${current.value || current.source}`, '');
// }

/**
 *
 * @param pathParamString path param will be like `string id`
 * @returns PathSegement
 */
export function convertPathParamStringToSegment(pathParamString: string): PathSegment {
    let pathSegment: PathSegment;
    const splitedPathParam: string[] = pathParamString.split(" ");
    const type: string = splitedPathParam[0];
    const name: string = pathParamString.substr(type.length + 1, pathParamString.length - 1);
    pathSegment = {
        id: 0,
        isParam: true,
        name,
        type
    };
    return pathSegment;
}

export function generateBallerinaResourcePath(path: Path): string {
    let pathAsString: string = "";
    path.segments.forEach((value, index, array) => {
        if (index === (array.length - 1)) {
            if (value.isLastSlash) {
                pathAsString += "/";
            } else if (value.isParam) {
                pathAsString += "[" + value.type + " " + value.name + "]";
            } else {
                pathAsString += value.name;
            }
        }
        else if (index === (array.length - 2) && array[array.length - 1].isLastSlash) {
            if (value.isLastSlash) {
                pathAsString += "/";
            } else if (value.isParam) {
                pathAsString += "[" + value.type + " " + value.name + "]";
            } else {
                pathAsString += value.name;
            }
        } else {
            if (value.isLastSlash) {
                pathAsString += "/";
            } else if (value.isParam) {
                pathAsString += "[" + value.type + " " + value.name + "]/";
            } else {
                pathAsString += value.name + "/";
            }
        }
    });
    return pathAsString;
}

export function getResourcePath(pathSegments: (DotToken | SlashToken | IdentifierToken
    | ResourcePathRestParam | ResourcePathSegmentParam)[]): string {

    return pathSegments.reduce((prev, current) => `${prev}${current.value ? current.value : current.source}`, '');
}

export function getParamString(parameters: (CommaToken | DefaultableParam | RequiredParam | IncludedRecordParam |
    RestParam)[]): string {
    return parameters.reduce((prev, current) => `${prev}${current.value ? current.value : current.source}`, '');
}

export function generateQueryParamFromST(params: STNode[]): string {
    let queryParamString: string = "";
    if (params && params.length > 0) {

        const filteredParams: STNode[] = [];
        params.forEach((value) => {
            if (!STKindChecker.isCommaToken(value) && !value.source.includes("@http:Payload") &&
                !value.source.includes("http:Request") && !value.source.includes("http:Caller") &&
                !value.source.includes("http:Headers")) {
                filteredParams.push(value);
            }
        });

        filteredParams.forEach((value, index, array) => {
            const equalsTokenSplit = value.source.trim().split("=");
            const splitedQueryParam = equalsTokenSplit[0].trim().split(/\s+/);
            let type: string = splitedQueryParam[0];
            let name: string = splitedQueryParam[1];
            let defaultValue: string;
            let mappedName: string;
            if (value.source.includes("@http:Header")) {
                if (STKindChecker.isRequiredParam(value)) {
                    type = `@${value.annotations[0]?.annotReference?.source?.trim()} ${value.typeName.source.trim()}`;
                    name = value.paramName?.value;
                    if (value.annotations[0]?.annotValue) {
                        mappedName = STKindChecker.isSpecificField(value.annotations[0]?.annotValue.fields[0]) ?
                            value.annotations[0]?.annotValue.fields[0].valueExpr?.source?.trim() : null;
                    }
                }
            }
            if (STKindChecker.isDefaultableParam(value)) {
                defaultValue = value.expression?.source?.trim();
                if (value.source.includes("@http:Header")) {
                    name = value.paramName?.value;
                    type = `@${value.annotations[0]?.annotReference?.source?.trim()} ${value.typeName.source.trim()}`;
                    if (value.annotations[0]?.annotValue) {
                        mappedName = STKindChecker.isSpecificField(value.annotations[0]?.annotValue.fields[0]) ?
                            value.annotations[0]?.annotValue.fields[0].valueExpr?.source?.trim() : null;
                    }
                }
            }
            if (index === (array.length - 1)) {
                queryParamString += mappedName ? `${type.split(/\s+/)[0]} {name: ${mappedName}} ${type.split(/\s+/)[1]} ${name}` : `${type} ${name}`;
                if (defaultValue) {
                    queryParamString += ` = ${defaultValue}`;
                }
            } else {
                if (defaultValue) {
                    queryParamString += mappedName ? `${type.split(/\s+/)[0]} {name: ${mappedName}} ${type.split(/\s+/)[1]} ${name} = ${defaultValue}, ` :
                        `${type} ${name} = ${defaultValue}, `;
                } else {
                    queryParamString += mappedName ? `${type.split(/\s+/)[0]} {name: ${mappedName}} ${type.split(/\s+/)[1]} ${name}, ` : `${type} ${name}, `;
                }
            }
        });
    }
    return queryParamString;
}

export function getParamDiagnostics(params: (CommaToken | DefaultableParam | IncludedRecordParam |
    RequiredParam | RestParam)[]): ResourceDiagnostics {
    let queryNameSemDiagnostic: string = "";
    let queryTypeSemDiagnostic: string = "";
    let payloadNameSemDiagnostic: string = "";
    let payloadTypeSemDiagnostic: string = "";
    let callerNameSemDiagnostics: string = "";
    let requestNameSemDiagnostics: string = "";
    let headersNameSemDiagnostics: string = "";
    if (params && params.length > 0) {
        params.forEach((value) => {
            if (!STKindChecker.isCommaToken(value) && !value.source?.includes("@http:Payload") &&
                !value.source?.includes("http:Request") && !value.source?.includes("http:Caller") &&
                !value.source?.includes("http:Headers")) {
                if (value.viewState?.diagnosticsInRange?.length > 0 && STKindChecker.isRequiredParam(value) ||
                    STKindChecker.isDefaultableParam(value)) {
                    if (value?.paramName?.viewState?.diagnosticsInRange && value?.paramName?.
                        viewState?.diagnosticsInRange[0]?.message) {
                        queryNameSemDiagnostic = value?.paramName?.viewState?.diagnosticsInRange && value?.paramName?.
                            viewState?.diagnosticsInRange[0]?.message;
                    }
                    if (value?.typeName?.viewState?.diagnosticsInRange && value?.
                        typeName?.viewState?.diagnosticsInRange[0]?.message) {
                        queryTypeSemDiagnostic = value?.typeName?.viewState?.diagnosticsInRange && value?.
                            typeName?.viewState?.diagnosticsInRange[0]?.message;
                    }
                }
            } else if (value.source?.includes("@http:Payload")) {
                if (value.viewState?.diagnosticsInRange?.length > 0 && STKindChecker.isRequiredParam(value) ||
                    STKindChecker.isDefaultableParam(value)) {
                    payloadNameSemDiagnostic = value?.paramName?.viewState?.diagnosticsInRange && value?.paramName?.
                        viewState?.diagnosticsInRange[0]?.message;
                    payloadTypeSemDiagnostic = value?.typeName?.viewState?.diagnosticsInRange && value?.
                        typeName?.viewState?.diagnosticsInRange[0]?.message;
                }
            } else if (value.source?.includes("@http:Caller")) {
                if (value.viewState?.diagnosticsInRange?.length > 0 && STKindChecker.isRequiredParam(value) ||
                    STKindChecker.isDefaultableParam(value)) {
                    callerNameSemDiagnostics = value?.paramName?.viewState?.diagnosticsInRange && value?.paramName?.
                        viewState?.diagnosticsInRange[0]?.message;
                }
            } else if (value.source?.includes("@http:Request")) {
                if (value.viewState?.diagnosticsInRange?.length > 0 && STKindChecker.isRequiredParam(value) ||
                    STKindChecker.isDefaultableParam(value)) {
                    requestNameSemDiagnostics = value?.paramName?.viewState?.diagnosticsInRange && value?.paramName?.
                        viewState?.diagnosticsInRange[0]?.message;
                }
            } else if (value.source?.includes("http:Headers")) {
                if (value.viewState?.diagnosticsInRange?.length > 0 && STKindChecker.isRequiredParam(value) ||
                    STKindChecker.isDefaultableParam(value)) {
                    headersNameSemDiagnostics = value?.paramName?.viewState?.diagnosticsInRange && value?.paramName?.
                        viewState?.diagnosticsInRange[0]?.message;
                }
            }
        });
        return {
            callerNameSemDiagnostics, headersNameSemDiagnostics, queryNameSemDiagnostic, queryTypeSemDiagnostic,
            requestNameSemDiagnostics, payloadTypeSemDiagnostic, payloadNameSemDiagnostic
        }
    }
}

export function generatePayloadParamFromST(params: STNode[]): AdvancedParams {
    let payload: Payload;
    let requestParamName;
    let callerParamName;
    let headerParamName;
    if (params && params.length > 0) {
        params.forEach((value) => {
            if (value?.source?.trim().includes("@http:Payload")) {
                payload = {
                    type: "",
                    name: "",
                    defaultValue: ""
                }
                if (STKindChecker.isRequiredParam(value)) {
                    payload.type = value.typeName.source.trim();
                    payload.name = value.paramName.value;
                } else if (STKindChecker.isDefaultableParam(value)) {
                    payload.type = value.typeName.source.trim();
                    payload.name = value.paramName.value;
                    payload.defaultValue = value.expression.value;
                }
            } else if (value?.source?.trim().includes("http:Request")) {
                if (STKindChecker.isRequiredParam(value)) {
                    requestParamName = value.paramName.value;
                } else if (STKindChecker.isDefaultableParam(value)) {
                    requestParamName = value.paramName.value;
                }
            } else if (value?.source?.trim().includes("http:Caller")) {
                if (STKindChecker.isRequiredParam(value)) {
                    callerParamName = value.paramName.value;
                } else if (STKindChecker.isDefaultableParam(value)) {
                    callerParamName = value.paramName.value;
                }
            } else if (value?.source?.trim().includes("http:Headers")) {
                if (STKindChecker.isRequiredParam(value)) {
                    headerParamName = value.paramName.value;
                } else if (STKindChecker.isDefaultableParam(value)) {
                    headerParamName = value.paramName.value;
                }
            }
        });
    }
    return {
        payload,
        requestParamName,
        callerParamName,
        headerParamName
    };
}

export function getPayloadString(payload: Payload): string {
    if (payload) {
        if (payload.defaultValue) {
            return `@http:Payload ${payload.type} ${payload.name} = ${payload.defaultValue}`;
        } else {
            return `@http:Payload ${payload.type} ${payload.name}`;
        }
    } else {
        return null;
    }
}

export function generateParamString(queryParamString: string, payloadString: string, advancedParamString: string): string {
    let paramString = "";
    if (advancedParamString && !payloadString && !queryParamString) {
        paramString = advancedParamString;
    } else if (advancedParamString && payloadString && !queryParamString) {
        paramString = `${advancedParamString}, ${payloadString}`;
    } else if (advancedParamString && !payloadString && queryParamString) {
        paramString = `${advancedParamString}, ${queryParamString}`;
    } else if (advancedParamString && payloadString && queryParamString) {
        paramString = `${advancedParamString}, ${payloadString}, ${queryParamString}`;
    } else if (!advancedParamString && payloadString && queryParamString) {
        paramString = `${payloadString}, ${queryParamString}`;
    } else if (!advancedParamString && payloadString && !queryParamString) {
        paramString = `${payloadString}`;
    } else if (!advancedParamString && !payloadString && queryParamString) {
        paramString = `${queryParamString}`;
    }
    return paramString;
}

export function generateAdvancedParamString(requestName: string, callerName: string, headersName: string): string {
    let paramString = "";
    if (headersName && !callerName && !requestName) {
        paramString += `http:Headers ${headersName}`;
    } else if (headersName && callerName && !requestName) {
        paramString += `http:Headers ${headersName}, http:Caller ${callerName}`;
    } else if (headersName && !callerName && requestName) {
        paramString += `http:Headers ${headersName}, http:Request ${requestName}`;
    } else if (headersName && callerName && requestName) {
        paramString += `http:Headers ${headersName}, http:Caller ${callerName}, http:Request ${requestName}`;
    } else if (!headersName && callerName && requestName) {
        paramString += `http:Caller ${callerName}, http:Request ${requestName}`;
    } else if (!headersName && callerName && !requestName) {
        paramString += `http:Caller ${callerName}`;
    } else if (!headersName && !callerName && requestName) {
        paramString += `http:Request ${requestName}`;
    }
    return paramString;
}

export function extractPayloadFromST(params: STNode[]): string {
    let payloadString: string = "";
    if (params && params.length > 0) {

        const payload: STNode[] = params.filter((value) => (value.source && value.source.includes("@http:Payload")));
        if (payload.length > 0) {
            payloadString = payload[0].source;
        }
    }
    return payloadString;
}

export function extractPayloadPositionFromST(params: STNode[]): NodePosition {
    if (params && params.length > 0) {

        const payloadNode = extractPayloadFromSTNode(params);
        if (payloadNode) {
            return payloadNode.position;
        }
    }
}

export function extractPayloadFromSTNode(params: STNode[]): STNode {
    if (params && params.length > 0) {

        const payload: STNode[] = params.filter((value) => (value.source && value.source.includes("@http:Payload")));
        if (payload.length > 0) {
            return payload[0];
        }
    }
}

export function generateQueryParamFromQueryCollection(params: QueryParamCollection): string {
    let queryParamString: string = "";
    if (params && params.queryParams && params.queryParams.length > 0) {
        queryParamString += "'?";
        params.queryParams.forEach((value, index, array) => {
            if (index === (array.length - 1)) {
                queryParamString += value.name + "='[" + value.type + " " + value.name + "']";
            } else {
                queryParamString += value.name + "='[" + value.type + " " + value.name + "']&";
            }
        });
    }
    return queryParamString;
}

export function generateQueryStringFromQueryCollection(params: QueryParamCollection): string {
    let queryParamString: string = "";
    if (params && params.queryParams && params.queryParams.length > 0) {
        params.queryParams.forEach((value, index, array) => {
            if (index === (array.length - 1)) {
                if (value.option === headerParameterOption) {
                    queryParamString += `@http:Header ${value.mappedName ? `{name: ${value.mappedName}}` : ""}${value.type} ${value.name}${value.defaultValue ? ` = ${value.defaultValue}` : ""}`;
                } else {
                    queryParamString += `${value.type} ${value.name}${value.defaultValue ? ` = ${value.defaultValue}` : ""}`;
                }
            } else {
                if (value.option === headerParameterOption) {
                    queryParamString += `@http:Header ${value.mappedName ? `{name: ${value.mappedName}}` : ""}${value.type} ${value.name}${value.defaultValue ? ` = ${value.defaultValue}, ` : ", "}`;
                } else {
                    queryParamString += `${value.type} ${value.name}${value.defaultValue ? ` = "${value.defaultValue}", ` : ", "}`;
                }
            }
        });
    }
    return queryParamString;
}

export function generateParameterSectionString(params: (DefaultableParam | RestParam | RequiredParam | IncludedRecordParam | CommaToken)[]): string {
    return params.reduce((prev, current) => `${prev}${current.value ? current.value : current.source}`, '');
}

export function getParameterType(param: string): PARAM_TYPES {
    if (param.includes('@http:Payload')) {
        return PARAM_TYPES.PAYLOAD;
    } else if (param.includes('http:Caller')) {
        return PARAM_TYPES.CALLER;
    } else if (param.includes('http:Request')) {
        return PARAM_TYPES.REQUEST;
    } else {
        return PARAM_TYPES.DEFAULT;
    }
}

export function generateReturnTypeFromReturnCollection(params: ReturnType[]): string {
    const returnTypeCollection: string[] = [];
    params.forEach(param => {
        if (param.type) {
            returnTypeCollection.push(`${param.type} ${param.isOptional ? "?" : ""}`);
        }
    })
    return returnTypeCollection.join("|");
}

export function getReturnType(returnTypeDesc: ReturnTypeDescriptor): string {
    if (returnTypeDesc) {
        return returnTypeDesc.type.source.trim();
    } else {
        return "";
    }
}

export function getReturnTypePosition(functionSignature: FunctionSignature, targetPosition?: NodePosition): NodePosition {
    if (functionSignature?.returnTypeDesc) {
        // during edit flow replace template from resource open param to return type end
        return {
            startLine: functionSignature?.openParenToken?.position?.startLine,
            startColumn: functionSignature?.openParenToken?.position?.startColumn,
            endLine: functionSignature?.returnTypeDesc?.position?.endLine,
            endColumn: functionSignature?.returnTypeDesc?.position?.endColumn,
        };
    } else if (targetPosition) {
        return { ...targetPosition, endLine: targetPosition.startLine, endColumn: targetPosition.startColumn };
    } else {
        return {
            endColumn: 0,
            endLine: 0,
            startColumn: 0,
            startLine: 0,
        };
    }
}

/** Generate resource params as template needed for return type validation during edit flow of resource */
export const generateResourceParamsTemplate = (
    params: STNode[],
    includeIsCaller: boolean
): { template: string; position: number } => {
    const containsCallerParam = isCallerParamAvailable(params);
    let requiredParams: string[] = params
        .filter((node) => STKindChecker.isRequiredParam(node))
        .map((node) => node.source);
    if (includeIsCaller && !containsCallerParam) {
        // Need to include 'http:Caller caller' if isCaller is checked but not originally included
        requiredParams = [...requiredParams, "http:Caller caller"];
    } else if (containsCallerParam && !includeIsCaller) {
        // Need to remove 'http:Caller caller' if isCaller is unchecked but was originally included
        requiredParams = requiredParams.filter(
            (paramSource) => !paramSource.includes("http:Caller")
        );
    }
    const template = `(${requiredParams.join(", ")}) returns `;
    return { template, position: template.length + 1 };
};

export function convertReturnTypeStringToSegments(returnTypeString: string): ReturnType[] {
    const returnTypeCollection: ReturnType[] = [];
    if (returnTypeString) {
        const codeReturnTypes = returnTypeString?.split("|");
        if (codeReturnTypes) {
            codeReturnTypes.forEach((returnType, index) => {
                if (returnType.includes("?")) {
                    returnTypeCollection.push({
                        type: returnType.replace("?", "").trim(), isOptional: true, id: index
                    });
                } else {
                    returnTypeCollection.push({ type: returnType.trim(), isOptional: false, id: index });
                }
            });
        }
    }
    return returnTypeCollection;
}

export function recalculateItemIds(items: any[]) {
    items.forEach((item, index) => {
        item.id = index;
    });
}

export function isCallerParamAvailable(params: STNode[]): boolean {
    let isCallerParam: boolean = false;
    if (params && params.length > 0) {

        const caller: STNode[] = params.filter((value) => (value.source && value.source.includes("http:Caller")));
        isCallerParam = caller.length > 0;
    }
    return isCallerParam;
}

export function isRequestParamAvailable(params: STNode[]): boolean {
    let isRequestParam: boolean = false;
    if (params && params.length > 0) {

        const caller: STNode[] = params.filter((value) => (value.source && value.source.includes("http:Request")));
        isRequestParam = caller.length > 0;
    }
    return isRequestParam;
}

export function noErrorTypeAvailable(returnTypeCollection: ReturnTypeCollection): boolean {
    let isErrorTypeAvailable: boolean = false;

    returnTypeCollection.types.forEach((value) => {
        if (value.type === "error") {
            isErrorTypeAvailable = value.type === "error";
        }
    });

    return isErrorTypeAvailable;
}

export function genParamName(defaultName: string, variables: string[]): string {
    let index = 0;
    let varName = defaultName;
    while (variables.includes(varName)) {
        index++;
        varName = defaultName + index;
    }
    return varName;
}


export function getParameterNameFromModel(param: (CommaToken | RequiredParam | RestParam | IncludedRecordParam
    | DefaultableParam)): string {
    if (STKindChecker.isRequiredParam(param) || STKindChecker.isDefaultableParam(param) ||
        STKindChecker.isIncludedRecordParam(param) || STKindChecker.isRestParam(param)) {
        return param.paramName.value
    }

    return '';
}

export function getParameterTypeFromModel(param: (CommaToken | RequiredParam | RestParam | IncludedRecordParam
    | DefaultableParam)): string {
    if (STKindChecker.isRequiredParam(param) || STKindChecker.isDefaultableParam(param) ||
        STKindChecker.isIncludedRecordParam(param) || STKindChecker.isRestParam(param)) {
        return param.typeName.source;
    }

    return '';
}

export async function getPartialSTForModuleMembers(
    partialSTRequest: PartialSTRequest,
    getLangClient: () => Promise<ExpressionEditorLangClientInterface>, isResource?: boolean): Promise<STNode> {
    const langClient: ExpressionEditorLangClientInterface = await getLangClient();
    const resp = isResource ? await langClient.getSTForResource(partialSTRequest) :
        await langClient.getSTForModuleMembers(partialSTRequest);
    return resp.syntaxTree;
}


export function addToTargetPosition(currentContent: string, position: NodePosition, codeSnippet: string): string {

    const splitContent: string[] = currentContent.split(/\n/g) || [];
    const splitCodeSnippet: string[] = codeSnippet.trimEnd().split(/\n/g) || [];
    const noOfLines: number = position.endLine - position.startLine + 1;
    const startLine = splitContent[position.startLine].slice(0, position.startColumn);
    const endLine = isFinite(position?.endLine) ?
        splitContent[position.endLine].slice(position.endColumn || position.startColumn) : '';

    const replacements = splitCodeSnippet.map((line, index) => {
        let modifiedLine = line;
        if (index === 0) {
            modifiedLine = startLine + modifiedLine;
        }
        if (index === splitCodeSnippet.length - 1) {
            modifiedLine = modifiedLine + endLine;
        }
        if (index > 0) {
            modifiedLine = " ".repeat(position.startColumn) + modifiedLine;
        }
        return modifiedLine;
    });

    splitContent.splice(position.startLine, noOfLines, ...replacements);

    return splitContent.join('\n');
}

export function getUpdatedSource(statement: string, currentFileContent: string, targetPosition: NodePosition, moduleList?: Set<string>, skipSemiColon?: boolean): string {

    const updatedStatement = skipSemiColon ? statement : (statement.trim().endsWith(';') ? statement : statement + ';');
    let updatedContent: string = addToTargetPosition(currentFileContent, targetPosition, updatedStatement);
    if (moduleList?.size > 0) {
        updatedContent = addImportStatements(updatedContent, Array.from(moduleList) as string[]);
    }

    return updatedContent;
}

export function addImportStatements(
    currentFileContent: string,
    modulesToBeImported: string[]): string {
    let moduleList: string = "";
    modulesToBeImported.forEach(module => {
        if (!currentFileContent.includes(module)) {
            moduleList += "import " + module + ";"; // INFO: Adding new line fix comes with code action PR
        }
    });
    return moduleList + currentFileContent;
}

export async function getKeywordTypes(docUri: string, getLangClient: () => Promise<ExpressionEditorLangClientInterface>) {
    const completionParams: CompletionParams = {
        textDocument: {
            uri: URI.file(docUri).toString()
        },
        context: {
            triggerKind: 25,
        },
        position: {
            character: 0,
            line: 0
        }
    }

    const langClient = await getLangClient();
    const completions: CompletionResponse[] = await langClient.getCompletion(completionParams);
    return completions.filter(value => value.kind === 25);
}

export function removeStatement(targetPosition: NodePosition): STModification {
    const removeLine: STModification = {
        startLine: targetPosition.startLine,
        startColumn: targetPosition.startColumn,
        endLine: targetPosition.endLine,
        endColumn: targetPosition.endColumn,
        type: 'DELETE'
    };

    return removeLine;
}

export function isStructuredType(node: STNode): boolean {
    // Add logic to determine if the node is a structured node (map/record/table/tuple/array/xml)
    // Return true if it's structured, false otherwise
    if (
        STKindChecker.isMapTypeDesc(node) ||
        STKindChecker.isRecordTypeDesc(node) ||
        STKindChecker.isTableTypeDesc(node) ||
        STKindChecker.isTupleTypeDesc(node) ||
        STKindChecker.isArrayTypeDesc(node) && STKindChecker.isSimpleNameReference(node.memberTypeDesc) ||
        STKindChecker.isArrayTypeDesc(node) && STKindChecker.isByteTypeDesc(node.memberTypeDesc) ||
        STKindChecker.isXmlTypeDesc(node) ||
        STKindChecker.isSimpleNameReference(node) ||
        STKindChecker.isOptionalTypeDesc(node) && STKindChecker.isSimpleNameReference(node.typeDescriptor)
    ) {
        return true;
    }
    return false;
}
