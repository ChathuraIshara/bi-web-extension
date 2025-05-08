/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";

export interface GetRecipientEPTemplatesArgs {
    name: string;
    description: string;
    endpoints: {
        type: string;
        value: string;
    }[];
    properties: {
        name: string;
        value: string;
        scope: string;
    }[];
}

export function getRecipientEPMustacheTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<endpoint name="{{name}}" xmlns="http://ws.apache.org/ns/synapse">
    <recipientlist>
        {{#endpoints}}
        {{#inline}}{{{value}}}{{/inline}}{{#static}}<endpoint key="{{value}}"/>{{/static}}
        {{/endpoints}}
    </recipientlist>
    {{#properties}}
    <property name="{{name}}" {{#scope}}scope="{{scope}}" {{/scope}}value="{{value}}"/>
    {{/properties}}
    <description>{{description}}</description>
</endpoint>`;
}

const getIndentedValue = (xmlString: string, indentBy: number = 8): string => {
    const lines = xmlString.split('\n');

    for (let i = 1; i < lines.length; i++) {
        lines[i] = ' '.repeat(indentBy) + lines[i];
    }

    return lines.join('\n');
};

export function getRecipientEPXml(data: GetRecipientEPTemplatesArgs) {
    const modifiedData = {
        ...data,
        endpoints: data.endpoints.map((endpoint) => {
            return {
                type: endpoint.type,
                value: getIndentedValue(endpoint.value.trim(), 8),
                [endpoint.type]: true,
            };
        }),
        properties: data.properties && data.properties.length > 0 ? data.properties.map((property) => {
            return {
                ...property,
                scope: property.scope !== "default" ? property.scope : undefined,
            };
        }) : undefined,
    };

    return render(getRecipientEPMustacheTemplate(), modifiedData);
}
