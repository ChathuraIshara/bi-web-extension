/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";

export interface GetBallerinaTemplatesArgs {
    name: string;
    version: string;
}

export function getBalModuleMustacheTemplate() {
    return `import wso2/mi;

@mi:Operation
public function calculateTotal(xml invoice) returns xml {
    xml<xml:Element> prices = invoice/**/<price>;
    int total = from xml:Element element in prices
        let int|error price = int:fromString(element.data())
        where price is int
        collect sum(price);
    return xml \`<total>\${total}</total>\`;
}`;
}

export function getBalConfigMustacheTemplate() {
    return `[package]
org = "miSdk"
name = "{{name}}"
version = "{{version}}"
distribution = "2201.11.0"
`;
}

export function getBallerinaModuleContent() {
    return render(getBalModuleMustacheTemplate(), {});
}

export function getBallerinaConfigContent(data: GetBallerinaTemplatesArgs) {
    return render(getBalConfigMustacheTemplate(), { name: data.name, version: data.version });
}
