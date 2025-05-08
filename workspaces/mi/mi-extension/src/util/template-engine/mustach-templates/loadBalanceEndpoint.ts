/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";

export interface GetLoadBalanceEPTemplatesArgs {
    name: string;
    algorithm: string;
    failover: string;
    buildMessage: string;
    sessionManagement: string;
    sessionTimeout: number;
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

export function getLoadBalanceEPMustacheTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<endpoint name="{{name}}" xmlns="http://ws.apache.org/ns/synapse">
    <loadbalance algorithm="{{algorithm}}" {{#buildMessage}}buildMessage="true"{{/buildMessage}} {{#failover}}failover="false"{{/failover}}>
        {{#endpoints}}
        {{#inline}}{{{value}}}{{/inline}}{{#static}}<endpoint key="{{value}}"/>{{/static}}
        {{/endpoints}}
    </loadbalance>
    {{#sessionManagement}}
    <session type="{{sessionManagement}}">
        <sessionTimeout>{{sessionTimeout}}</sessionTimeout>
    </session>
    {{/sessionManagement}}
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

export function getLoadBalanceEPXml(data: GetLoadBalanceEPTemplatesArgs) {
    const modifiedData = {
        ...data,
        buildMessage: data.buildMessage === "true" ? data.buildMessage : undefined,
        failover: data.failover === "false" ? data.failover : undefined,
        endpoints: data.endpoints.map((endpoint) => {
            return {
                type: endpoint.type,
                value: getIndentedValue(endpoint.value.trim(), 8),
                [endpoint.type]: true,
            };
        }),
        sessionManagement: data.sessionManagement !== "none" ? data.sessionManagement : undefined,
        properties: data.properties.length > 0 ? data.properties.map((property) => {
            return {
                ...property,
                scope: property.scope !== "default" ? property.scope : undefined,
            };
        }) : undefined,
    };

    return render(getLoadBalanceEPMustacheTemplate(), modifiedData);
}
