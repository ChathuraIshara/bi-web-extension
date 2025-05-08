/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface ConfigProperty {
    name: string;
    type: string;
    property: Property;
    required?: boolean;
    orgKey?: string;  
    pkgKey?: string;
}

export interface Property {
    name?: string;
    type: string;
    additionalProperties?: { type: string };
    properties?: {};
    required?: string[];
    description?: string;
    items?: Property;
}

export enum Constants {
    ENUM = "enum",
    ITEMS = "items",
    TYPE = "type",
    VALUE = "value",
    NAME = "name",
    DESCRIPTION = "description",
    PROPERTIES = "properties",
    REQUIRED = "required",
    ADDITIONAL_PROPERTIES = "additionalProperties",
    ANY_OF = "anyOf",
    ARRAY = "array",
    MODULE = "module",
    OBJECT = "object",
    ARRAY_TYPE = "arrayType",
    FLOAT = "float",
    INTEGER = "integer",
    HTTP = "http"
}

/**
 * xml no type defined but string value
 * tuple no type defined
 * map no type defined
 * record no type defined
 * table and table[] as arrays
 */ 
export enum ConfigTypes {
    BOOLEAN = "boolean",
    INTEGER = "integer",
    NUMBER = "number",
    STRING = "string",
    ARRAY = "array",
    OBJECT = "object",
    ENUM = "enum",
    ANY_OF = "anyOf",
}
