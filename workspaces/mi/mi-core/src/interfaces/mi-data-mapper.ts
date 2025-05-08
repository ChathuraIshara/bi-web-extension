/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
export const DM_FUNCTION_NAME = "mapFunction";
export interface DMType {
    kind: TypeKind;
    typeName?: string;
    fieldName?: string;
    memberType?: DMType;
    defaultValue?: unknown;
    optional?: boolean;
    fields?: DMType[];
    unionTypes?: DMType[];
    resolvedUnionType?: DMType;
    isRecursive?: boolean;
}

export enum TypeKind {
    Interface = 'interface',
    Array = 'array',
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
    Object = 'object',
    Union = 'union',
    Literal = 'literal',
    Unknown = 'unknown'
}
