/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
export const variableNameMaxLength = 35;

export function truncateText(value: string) {
    if (!value)
        return undefined
    else if (value.length > variableNameMaxLength)
        return value.slice(0, variableNameMaxLength) + "...";
    else
        return value;
}

export function getExampleForType(model: any) {
    switch (model?.type){
        case 'var': return `"Hello", 5`;
        case 'string': return `"Ballerina"`;
        case 'int': return `1234, -10, +2020, 1+2`;
        case 'float': return `0.3353, -8593.992, +950.930,\n 34.21+21.4, <int>value`;
        case 'decimal': return `1d/1000000000d`;
        case 'boolean': return `true, false`;
        case 'json': return `{name: "apple", color: "red"}`;
        case 'xml': return `xml \`Hello, world!\``;
        case 'error': return `error("errorType", message = "errorMsg")`;
        case 'any': return `1, "Ballerina", true`;
        case 'anydata': return `[1, "string", true]`;
        default: return '';
    }
}
