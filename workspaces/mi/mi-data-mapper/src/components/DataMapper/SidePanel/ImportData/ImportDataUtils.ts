/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { SourceFile } from "ts-morph";

export function validateJSON(fileContent: string) {
    JSON.parse(fileContent);
};

export function validateCSV(fileContent: string) {
    const rows = fileContent.trim().split("\n");
    const columnCount = rows[0].split(',').length;
    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',');
        if (columns.length !== columnCount) {
            throw new Error();
        }
    }
};

export function validateXML(fileContent: string) {
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(fileContent, "application/xml");
    const parserError = parsedDocument.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
        throw new Error();
    }
};

export function validateJSONSchema(fileContent: string) {
    const ajv = new Ajv();
    addFormats(ajv);
    try {
        const schema = JSON.parse(fileContent);
        const valid = ajv.validateSchema(schema);
        if (!valid) {
            throw new Error();
        }
    } catch (error) {
        throw new Error();
    }
};

export function validateInterfaceName(value: string, sourceFile: SourceFile) {
    try {

        if (value[0] !== value[0].toUpperCase()) return "Type name must start with a capital";

        if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) return "Invalid type name";

        if (sourceFile.getInterface(value) ||
            sourceFile.getClass(value) ||
            sourceFile.getTypeAlias(value) ||
            sourceFile.getEnum(value)
        ) return "Type name is not available";

        sourceFile.addInterface({ name: value }).remove(); //To catch any other remaining issues

    } catch (error) {
        return "Invalid type name";
    }
    return true;
};
