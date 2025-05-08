/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";

interface Parameter {
    [key: string]: string | number | boolean;
}

interface NameValuePair {
    name: string;
    value: string | boolean | number;
}

export interface GetInboundTemplatesArgs {
    attributes: {};
    parameters: {};
}

export function getInboundEndpointMustacheTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<inboundEndpoint{{#attributes}} {{name}}="{{value}}"{{/attributes}}>
    <parameters xmlns="http://ws.apache.org/ns/synapse">
    {{#params}}
        <parameter name="{{name}}">{{value}}</parameter>
    {{/params}}
    </parameters>
</inboundEndpoint>`;
}

export function getInboundEndpointdXml(data: GetInboundTemplatesArgs) {
    const { parameters, attributes } = data;

    const modifiedData = {
        attributes: transformJsonObject(attributes),
        params: transformJsonObject(parameters)
    };

    return render(getInboundEndpointMustacheTemplate(), modifiedData);
}

function transformJsonObject(obj: { [key: string]: string | boolean | number }): NameValuePair[] {
    return Object.entries(obj).map(([key, value]) => ({
        name: key,
        value: value
    }));
}
