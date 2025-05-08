/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";

export interface APIResourceArgs {
    methods: string[];
    uriTemplate: string;
}

export interface APIMetadataArgs {
    name: string;
    version: string;
    context: string;
    versionType: string | false;
}

function getAPIResourceMustacheTemplate() {
    return `<resource methods="{{methods}}"{{#uriTemplate}} uri-template="{{uriTemplate}}"{{/uriTemplate}}>
    <inSequence>
    </inSequence>
    <faultSequence>
    </faultSequence>
</resource>`;
};

function getMetadataMustacheTemplate() {
    return `---
key: "{{name}}-{{version}}"
name : "{{name}}"
displayName : "{{name}}"
description: "{{name}}"
version: "{{version}}"
serviceUrl: "https://{MI_HOST}:{MI_PORT}{{context}}{{#versionType}}/{{version}}{{/versionType}}"
definitionType: "OAS3"
securityType: "BASIC"
mutualSSLEnabled: false`
};

export function getAPIResourceXml(data: any) {
    data.methods = data.methods.join(" ");
    return render(getAPIResourceMustacheTemplate(), data);
}

export function getAPIMetadata(data: APIMetadataArgs) {
    return render(getMetadataMustacheTemplate(), data);
}

