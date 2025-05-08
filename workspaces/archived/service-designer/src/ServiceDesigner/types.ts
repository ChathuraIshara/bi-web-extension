/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { DiagramDiagnostic, Field } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition, RecordTypeDesc, STNode, TypeDefinition } from "@wso2-enterprise/syntax-tree";

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
    option: string;
    mappedName?: string;
    defaultValue?: string;
}

export interface ReturnType {
    id: number;
    type: string;
    isOptional: boolean
}

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
    initialPathDiagnostics?: DiagramDiagnostic[];
}

export interface Payload {
    type: string;
    name: string;
    defaultValue?: string;
}

export interface AdvancedParams {
    payload?: Payload;
    requestParamName?: string;
    callerParamName?: string;
    headerParamName?: string;
}

export interface ResourceDiagnostics {
    queryNameSemDiagnostic?: string;
    queryTypeSemDiagnostic?: string;
    payloadNameSemDiagnostic?: string;
    payloadTypeSemDiagnostic?: string;
    callerNameSemDiagnostics?: string;
    requestNameSemDiagnostics?: string;
    headersNameSemDiagnostics?: string;
}

export interface Advanced {
    isCaller?: boolean;
    isRequest?: boolean;
}

export interface AdvancedResourceState {
    path: Map<number, boolean>;
    payloadSelected: Map<number, boolean>;
}

export interface RecordEditorProps {
    name: string;
    model?: RecordTypeDesc | TypeDefinition;
    targetPosition?: NodePosition;
    formType: string;
    isTypeDefinition?: boolean;
    isDataMapper?: boolean;
    onCancel: (createdNewRecord?: string) => void;
    onSave: (typeDesc: string, recModel: RecordModel) => void;
    showHeader?: boolean;
    filePath?: string;
    currentST?: STNode;
}
export interface RecordModel {
    name: string;
    type?: string;
    fields: Field[];
    isInline?: boolean;
    isOptional?: boolean;
    isArray?: boolean;
    isClosed?: boolean;
    isActive?: boolean;
    isTypeDefinition?: boolean;
    isPublic?: boolean;
}
