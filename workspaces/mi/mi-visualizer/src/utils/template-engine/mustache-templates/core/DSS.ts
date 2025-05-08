/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export function getAddResourceTemplate() {
    return `<resource method="{{method}}" path="{{path}}"{{#returnRequestStatus}} returnRequestStatus="true"{{/returnRequestStatus}}{{#enableStreaming}} disableStreaming="true"{{/enableStreaming}}>
{{#description}}    <description>{{description}}</description>{{/description}}
<call-query href="{{query}}" />
</resource>`
}

export function getEditResourceTemplate() {
    return `<resource method="{{method}}" path="{{path}}"{{#returnRequestStatus}} returnRequestStatus="true"{{/returnRequestStatus}}{{#enableStreaming}} disableStreaming="true"{{/enableStreaming}}>`
}

export function getAddOperationTemplate() {
    return `<operation name="{{name}}"{{#enableStreaming}} disableStreaming="true"{{/enableStreaming}}>
{{#description}}    <description>{{description}}</description>{{/description}}
<call-query href="{{query}}" />
</operation>`
}

export function getAddQuery() {
    return `<query id="{{name}}" useConfig="{{dbName}}">
<sql></sql>
</query>`
}

export function getEditOperationTemplate() {
    return `<operation name="{{name}}"{{#enableStreaming}} disableStreaming="true"{{/enableStreaming}}>`
}

export function getEditDescriptionTemplate() {
    return `<description>{{description}}</description>`
}
