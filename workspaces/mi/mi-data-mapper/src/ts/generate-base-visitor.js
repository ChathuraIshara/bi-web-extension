/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("ts-morph");
var fs = require("fs");

var excludedSuffixes = [
    'Token',
    'Keyword',
    'Trivia',
    'WhiteSpaces',
    'Unknown',
    'Signature',
    'Type',
    'Operator',
    'Text',
    'Word',
    'Assignment',
    'Accessor'
];

var kinds = Object.keys(ts.SyntaxKind).filter(function (k) {
    return isNaN(Number(k))
        && !excludedSuffixes.some(function (suffix) { return k.endsWith(suffix); });
});

const visitorFunctions = kinds.map(kind => {
    return `
    beginVisit${kind}?(node: tsm.${kind}, parent?: tsm.Node): void;
    endVisit${kind}?(node: tsm.${kind}, parent?: tsm.Node): void;`;
}).join('\n');

const headerComment = `/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 * Run 'npm run generate' to regenerate this file
 */
`

var fileContent = `${headerComment}
import * as tsm from 'ts-morph';

export interface Visitor {
    beginVisit?(node: tsm.Node, parent?: tsm.Node): void;
    endVisit?(node: tsm.Node, parent?: tsm.Node): void;
    ${visitorFunctions}
}
`;

fs.writeFileSync('./base-visitor.ts', fileContent);
