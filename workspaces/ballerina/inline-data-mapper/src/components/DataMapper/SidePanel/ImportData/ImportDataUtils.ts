/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

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
