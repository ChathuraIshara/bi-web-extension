export interface PathSegment {
    id: number;
    isParam: boolean;
    type?: string;
    name: string;
    isLastSlash?: boolean;
}

export interface Path {
    segments: PathSegment[];
}

export interface QueryParam {
    id: number;
    type: string;
    name: string;
}

export interface ReturnType {
    id: number;
    type: string;
    isOptional: boolean
}

export const ReturnTypesMap: Map<string, string> = new Map([
    ["string", `""`],
    ["int", "1"],
    ["boolean", "false"],
    ["error", "()"],
]);

export interface ReturnTypeCollection {
    types: ReturnType[];
    defaultReturnValue?: string;
}

export interface QueryParamCollection {
    queryParams: QueryParam[];
}

export interface Resource {
    id: number;
    method: string;
    path: string;
    queryParams?: string;
    payload?: string;
    payloadError?: boolean;
    isCaller?: boolean;
    isRequest?: boolean;
    returnType?: string;
    isPathDuplicated?: boolean;
    returnTypeDefaultValue?: string;
}

export interface Payload {
    type: string;
    name: string;
}

export interface Advanced {
    isCaller?: boolean;
    isRequest?: boolean;
}

export interface AdvancedResourceState {
    path: Map<number, boolean>;
    payloadSelected: Map<number, boolean>;
}
