/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";

interface Property {
    key: string,
    value: string,
    isLiteral: boolean,
}
export interface GetTaskTemplatesArgs {
    name: string;
    group: string;
    implementation: string;
    pinnedServers: string;
    triggerType: "simple" | "cron";
    triggerCount: number | null;
    triggerInterval: number;
    triggerCron: string;
    taskProperties: Property[];
    customProperties: any[];
}

export function getTaskMustacheTemplate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<task class="{{implementation}}" group="{{group}}" name="{{name}}"{{#pinnedServers}} pinnedServers="{{pinnedServers}}"{{/pinnedServers}} xmlns="http://ws.apache.org/ns/synapse">
    <trigger{{#cron}} cron="{{cron}}"{{/cron}}{{#once}} once="true"{{/once}}{{#count}} count="{{count}}"{{/count}}{{#interval}} interval="{{interval}}"{{/interval}}/>
    {{#taskProperties}}
    {{#key}}
    {{#isLiteral}}
    <property xmlns:task="http://www.wso2.org/products/wso2commons/tasks" name="{{key}}" value="{{value}}"/>
    {{/isLiteral}}
    {{^isLiteral}}
    <property xmlns:task="http://www.wso2.org/products/wso2commons/tasks" name="{{key}}">{{{value}}}</property>
    {{/isLiteral}}
    {{/key}}
    {{/taskProperties}}
    {{#customProperties}}
    <property xmlns:task="http://www.wso2.org/products/wso2commons/tasks" name="{{key}}" value="{{value}}"/>
    {{/customProperties}}
</task>`;
}

export function getTaskXml(data: GetTaskTemplatesArgs) {
    const modifiedData = {
        ...data,
        ...(data.triggerType === "simple"
            ? data.triggerCount === 1 && data.triggerInterval === 1
                ? { once: true }
                : { count: data.triggerCount, interval: data.triggerInterval }
            : { cron: data.triggerCron }
        )
    };

    return render(getTaskMustacheTemplate(), modifiedData);
}
