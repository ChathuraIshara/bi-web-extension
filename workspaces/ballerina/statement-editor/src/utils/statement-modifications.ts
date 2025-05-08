/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { STModification } from "@wso2-enterprise/ballerina-core";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

export const keywords = [
    "if", "else", "fork", "join", "while", "foreach",
    "in", "return", "returns", "break", "transaction",
    "transactional", "retry", "commit", "rollback", "continue",
    "typeof", "enum", "wait", "check", "checkpanic", "panic",
    "trap", "match", "import", "version", "public", "private",
    "as", "lock", "new", "record", "limit", "start", "flush",
    "untainted", "tainted", "abstract", "external", "final",
    "listener", "remote", "is", "from", "on", "select", "where",
    "annotation", "type", "function", "resource", "service", "worker",
    "object", "client", "const", "let", "source", "parameter", "field",
    "xmlns", "true", "false", "null", "table", "key", "default", "do",
    "base16", "base64", "conflict", "outer", "equals", "boolean", "int",
    "float", "string", "decimal", "handle", "var", "any", "anydata", "byte",
    "future", "typedesc", "map", "json", "xml", "error", "never", "readonly",
    "distinct", "stream"
];

export function getStatementModification(statement: string, targetPosition: NodePosition): STModification {
    return {
        startLine: targetPosition.startLine,
        startColumn: targetPosition.startColumn,
        endLine: targetPosition?.endLine || targetPosition.startLine,
        endColumn: targetPosition?.endColumn || targetPosition.startColumn,
        type: "INSERT",
        isImport: false,
        config: {
            "STATEMENT": statement
        }
    };
}

export function getImportModification(moduleNameStr: string): STModification {
    const importStatement: STModification = {
        startLine: 0,
        startColumn: 0,
        endLine: 0,
        endColumn: 0,
        type: "IMPORT",
        config: {
            "TYPE": moduleNameStr
        }
    };

    return importStatement;
}

export function getFQModuleName(org: string, module: string): string {
    let moduleNameStr = org + "/" + module;
    const moduleName = module.includes('.') ? module.split('.').pop() : module;

    if (keywords.includes(moduleName)) {
        // add alias if module name is different with formatted name
        moduleNameStr = `${org}/${module.split('.')[0]}.'${moduleName} as ${moduleName}0`
    }

    return moduleNameStr;
}
