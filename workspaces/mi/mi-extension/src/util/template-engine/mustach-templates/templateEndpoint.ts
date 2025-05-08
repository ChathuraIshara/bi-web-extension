/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";

export interface GetTemplateEPTemplatesArgs {
    name: string;
    uri: string;
    template: string;
    description: string;
    parameters: {
        name: string;
        value: string;
    }[];
}

export function getTemplateEPMustacheTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<endpoint name="{{name}}" template="{{template}}" {{#uri}}uri="{{uri}}" {{/uri}}xmlns="http://ws.apache.org/ns/synapse">
    {{#parameters}}
    <axis2ns{{id}}:parameter name="{{name}}" value="{{value}}" xmlns:axis2ns{{id}}="http://ws.apache.org/ns/synapse"/>
    {{/parameters}}
    <description>{{description}}</description>
</endpoint>`;
}

export function getTemplateEPXml(data: GetTemplateEPTemplatesArgs) {
    const modifiedData = {
        ...data,
        parameters: data.parameters.length > 0 ? data.parameters.map((property, index) => {
            return {
                ...property,
                id: (index + 1).toString().padStart(2, '0')
            };
        }) : undefined,
    };

    return render(getTemplateEPMustacheTemplate(), modifiedData);
}
