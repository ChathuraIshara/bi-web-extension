import { ExpressionEditorCustomTemplate } from "@wso2-enterprise/ballerina-expression-editor";
import { DiagramDiagnostic } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FunctionSignature, NodePosition, ReturnTypeDescriptor, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";

import {
    Path,
    PathSegment,
    Payload,
    QueryParam,
    QueryParamCollection,
    Resource,
    ReturnType,
    ReturnTypeCollection,
} from "./types";

export const payloadTypes: string[] = ["json", "xml", "byte[]", "string"];
export const queryParamTypes: string[] = ["string", "int"];
export const pathParamTypes: string[] = ["string", "int"];
export const returnTypes: string[] = ["http:Response", "json", "xml", "string", "int", "boolean", "float"];
export const functionParamTypes: string[] = ["json", "xml", "string", "int", "boolean", "float"];
export const functionReturnTypes: string[] = ["json", "xml", "string", "int", "boolean", "float", "error"];

export function convertPayloadStringToPayload(payloadString: string): Payload {
    const payload: Payload = {
        type: "",
        name: ""
    }
    if (payloadString && payloadString !== "") {
        const payloadSplitted = payloadString.split("@http:Payload");
        if (payloadSplitted.length > 1) {
            const typeNameSplited = payloadSplitted[payloadSplitted.length - 1].trim().split(" ");
            payload.type = typeNameSplited[0];
            payload.name = typeNameSplited[1];
        }
    }
    return payload;
}

export function getBallerinaPayloadType(payload: Payload, addComma?: boolean): string {
    return payload.type && payload.name && payload.type !== ""
        && payload.name !== "" ? ("@http:Payload " + payload.type + " " + payload.name + (addComma ? ", " : "")) : "";
}

export function convertQueryParamStringToSegments(queryParamsString: string): QueryParamCollection {
    const queryParamCollection: QueryParamCollection = {
        queryParams: []
    };

    if (queryParamsString && queryParamsString !== "") {
        const queryParamSplited: string[] = queryParamsString.split("&");
        queryParamSplited.forEach((value, index) => {
            const queryParam: QueryParam = {
                id: index,
                name: "",
                type: ""
            };
            if (value.includes("=")) {
                const splitedParam: string[] = value.split("=");
                if (splitedParam.length === 2 && splitedParam[1].startsWith("'[") && splitedParam[1].endsWith("']")) {
                    const formattedQueryParam = splitedParam[1].replace("'[", "").replace("']", "");
                    const splitedNameAndType: string[] = formattedQueryParam.split(" ");
                    queryParam.id = index;
                    queryParam.name = splitedNameAndType[1];
                    queryParam.type = splitedNameAndType[0];
                    queryParamCollection.queryParams.push(queryParam);
                } else if (splitedParam.length === 2 && splitedParam[1].startsWith("{") && splitedParam[1].endsWith("}")) {
                    const formattedQueryParam = splitedParam[1].replace("{", "").replace("}", "");
                    queryParam.id = index;
                    queryParam.name = formattedQueryParam;
                    queryParam.type = "string";
                    queryParamCollection.queryParams.push(queryParam);
                }
            }
        });
    }

    return queryParamCollection;
}

/**
 *
 * @param path path will be like `/name/[string name]/id/[int id]`
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

export function genrateBallerinaResourcePath(path: Path): string {
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

export function genrateBallerinaQueryParams(queryParamCollection: QueryParamCollection, addLastComma?: boolean): string {
    let queryParamsAsString: string = "";
    queryParamCollection.queryParams.forEach((value, index, array) => {
        if (index === (array.length - 1)) {
            queryParamsAsString += value.type + " " + value.name + (addLastComma ? ", " : "");
        } else {
            queryParamsAsString += value.type + " " + value.name + ", ";
        }
    });
    return queryParamsAsString;
}

export function generateQueryParamFromST(params: STNode[]): string {
    let queryParamString: string = "";
    if (params && params.length > 0) {

        const filteredParams: STNode[] = [];
        params.forEach((value) => {
            if (!STKindChecker.isCommaToken(value) && !value.source.includes("@http:Payload") && !value.source.includes("http:Request") && !value.source.includes("http") && !value.source.includes("Request") && !value.source.includes("http:Caller") && !value.source.includes("Caller")) {
                filteredParams.push(value);
            }
        });

        if (filteredParams.length > 0) {
            queryParamString += "?";
        }

        filteredParams.forEach((value, index, array) => {
            const queryParamSource = value.source.trim();
            const splitedQueryParam = queryParamSource.split(" ");
            const type: string = splitedQueryParam[0];
            const name: string = queryParamSource.substr(type.length + 1, queryParamSource.length - 1);
            if (index === (array.length - 1)) {
                queryParamString += name + "='[" + type + " " + name + "']";
            } else {
                queryParamString += name + "='[" + type + " " + name + "']&";
            }
        });
    }
    return queryParamString;
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
    }else {
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

export function getReturnTypeTemplate(
    functionSignature: FunctionSignature,
    resource: Resource
): ExpressionEditorCustomTemplate {
    const isCallerTemplate = "http:Caller caller";
    if (functionSignature?.returnTypeDesc && resource.returnType) {
        const editTemplate = generateResourceParamsTemplate(
            functionSignature?.parameters,
            resource.isCaller
        );
        return {
            defaultCodeSnippet: editTemplate.template,
            targetColumn: editTemplate.position,
        };
    } else {
        return {
            defaultCodeSnippet: `resource function post tempResource(${resource.isCaller ? isCallerTemplate : ""}) returns  {}`,
            targetColumn: 47 + (resource.isCaller ? isCallerTemplate.length : 0),
        }
    }
}

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

export function extractPathData(text: string): Resource {
    const resource: Resource = {
        id: 0,
        method: "GET",
        path: ""
    };
    const splittedPath: string[] = text.split("?");
    const path: Path = convertPathStringToSegments(splittedPath[0]);
    if (splittedPath.length > 1) {
        const queryParams: QueryParamCollection = convertQueryParamStringToSegments(splittedPath[1]);
        resource.queryParams = generateQueryParamFromQueryCollection(queryParams);
    }
    resource.id = 0;
    resource.path = genrateBallerinaResourcePath(path);
    return resource;
}

export const getPathDiagnostics = (resources: any[] = []): DiagramDiagnostic[] => resources?.reduce((items, resource) => {
    if (resource?.typeData?.diagnostics){
        return [...items, ...resource?.typeData?.diagnostics]
    }
    return items;
}, []);

