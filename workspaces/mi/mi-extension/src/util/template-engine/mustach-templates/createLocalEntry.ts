/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as fs from "fs";
const {XMLParser, XMLBuilder} = require("fast-xml-parser");

export function generateXmlData(
    name: string,
    type: string,
    value: string,
    URL: string
): string {
    const options = {
        ignoreAttributes: false,
        allowBooleanAttributes: true,
        attributeNamePrefix: "",
        attributesGroupName: "@_",
        cdataPropName: "#cdata",
        indentBy: '    ',
        format: true,
    };
    const parser = new XMLParser(options);
    const builder = new XMLBuilder(options);
    const localEntryType = type.toLowerCase();
    let localEntryAttributes = "";
    let otherAttributes = "";
    if (localEntryType === "in-line text entry") {
        localEntryAttributes = `<![CDATA[${value}]]>`;
    } else if (localEntryType === "in-line xml entry") {
        localEntryAttributes = value;
    } else if (localEntryType=== "source url entry") {
        otherAttributes = `src="${URL}"`;
    }
    
    const localEntryTemplate= `<?xml version="1.0" encoding="UTF-8"?>
    <localEntry key="${name}" ${otherAttributes} xmlns="http://ws.apache.org/ns/synapse">
        ${localEntryAttributes}
    </localEntry>
    `;
    
    const jsonData = parser.parse(localEntryTemplate);
    return builder.build(jsonData).replace(/&apos;/g, "'");
}

export function writeXmlDataToFile(filePath: string, xmlData: string): void {
    fs.writeFileSync(filePath, xmlData);
}
