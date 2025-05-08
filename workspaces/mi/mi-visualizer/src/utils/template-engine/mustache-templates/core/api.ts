/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export function getAddAPITemplate() {
    return `<?xml version="1.0" encoding="UTF-8" ?>
    <api context="{{context}}" name="{{name}}"{{#version}} version="{{version}}"{{/version}}{{#versionType}} version-type="{{versionType}}"{{/versionType}} xmlns="http://ws.apache.org/ns/synapse">
        <resource methods="GET" uri-template="/">
            <inSequence>
            </inSequence>
            <faultSequence>
            </faultSequence>
        </resource>
    </api>`
}

export function getEditAPITemplate() {
    return `<api{{#hostName}} hostname="{{hostName}}"{{/hostName}} name="{{name}}"{{#port}} port="{{port}}"{{/port}}{{#statistics}} statistics="enable"{{/statistics}}{{#trace}} trace="enable"{{/trace}} context="{{context}}"{{#swaggerDef}} publishSwagger="{{swaggerDef}}"{{/swaggerDef}}{{#version}} version="{{version}}" version-type="{{version_type}}"{{/version}} xmlns="http://ws.apache.org/ns/synapse">`
}

export function getHandlersTemplate() {
    return `{{#show}}<handlers>
    {{#handlers}}<handler class="{{name}}">{{#properties}}
        <property name="{{name}}" value="{{value}}"/>{{/properties}}
    </handler>{{/handlers}}
</handlers>{{/show}}`;
};

export function getAddAPIResourceTemplate() {
    return `<resource methods="{{methods}}"{{#protocol}} protocol="{{protocol}}"{{/protocol}}{{#uri_template}} uri-template="{{uri_template}}"{{/uri_template}}{{#url_mapping}} url-mapping="{{url_mapping}}"{{/url_mapping}}{{#version}} version="{{version}}" version-type="{{version_type}}"{{/version}}>
    <inSequence>
    </inSequence>
    <faultSequence>
    </faultSequence>
</resource>`;
}

export const getEditAPIResourceTemplate = () => {
    return `<resource methods="{{methods}}"{{#protocol}} protocol="{{protocol}}"{{/protocol}}{{#uri_template}} uri-template="{{uri_template}}"{{/uri_template}}{{#url_mapping}} url-mapping="{{url_mapping}}"{{/url_mapping}}{{#in_sequence}} inSequence="{{in_sequence}}"{{/in_sequence}}{{#out_sequence}} outSequence="{{out_sequence}}"{{/out_sequence}}{{#fault_sequence}} faultSequence="{{fault_sequence}}"{{/fault_sequence}}>{{#appened_in_sequence}}
    <inSequence>
    </inSequence>{{/appened_in_sequence}}{{#appened_fault_sequence}}
    <faultSequence>
    </faultSequence>{{/appened_fault_sequence}}`;
}

export const getEditSequenceTemplate = () => {
    return `<sequence name="{{name}}"{{#trace}} trace="{{trace}}"{{/trace}}{{#statistics}} statistics="{{statistics}}"{{/statistics}}{{#onError}} onError="{{onError}}"{{/onError}} xmlns="http://ws.apache.org/ns/synapse">`
}

export const getEditProxyProxyTemplate = () => {
    return `<proxy name="{{name}}" {{#trace}}trace="{{trace}}"{{/trace}} {{#onError}} onError="{{onError}}"{{/onError}} {{#pinnedServers}}pinnedServers="{{pinnedServers}}"{{/pinnedServers}} {{#serviceGroup}}serviceGroup="{{serviceGroup}}"{{/serviceGroup}}  {{#startOnLoad}}startOnLoad="{{startOnLoad}}"{{/startOnLoad}} {{#statistics}}statistics="{{statistics}}"{{/statistics}} {{#transports}}transports="http https"{{/transports}}  xmlns="http://ws.apache.org/ns/synapse">
</proxy>
`
}

export const getEditProxyTemplate = (name:string) => {
    switch (name) {
        case "proxy":
            return `<proxy name="{{name}}" {{#trace}}trace="{{trace}}"{{/trace}} {{#onError}} onError="{{onError}}"{{/onError}} {{#pinnedServers}}pinnedServers="{{pinnedServers}}"{{/pinnedServers}} {{#serviceGroup}}serviceGroup="{{serviceGroup}}"{{/serviceGroup}}  {{#startOnLoad}}startOnLoad="{{startOnLoad}}"{{/startOnLoad}} {{#statistics}}statistics="{{statistics}}"{{/statistics}} {{#transports}}transports="{{transports}}"{{/transports}}  xmlns="http://ws.apache.org/ns/synapse">`
        case "target":
            return `<target {{#endpoint}}endpoint="{{endpoint}}"{{/endpoint}} {{#inSequence}}inSequence="{{inSequence}}"{{/inSequence}} {{#outSequence}}outSequence="{{outSequence}}"{{/outSequence}} {{#faultSequence}}faultSequence="{{faultSequence}}"{{/faultSequence}}>`
        case "other":
            return `{{#wsdlEnabled}}
            <publishWSDL {{#publishWsdl.key}}key="{{{publishWsdl.key}}}"{{/publishWsdl.key}} {{#publishWsdl.preservePolicy}}preservePolicy="{{publishWsdl.preservePolicy}}"{{/publishWsdl.preservePolicy}} {{#publishWsdl.uri}}uri="{{{publishWsdl.uri}}}"{{/publishWsdl.uri}}>
                {{#publishWsdl.inlineWsdl}}{{{publishWsdl.inlineWsdl}}}{{/publishWsdl.inlineWsdl}}
                {{#publishWsdl.resource}}<resource key="{{{key}}}" location="{{{location}}}"/>{{/publishWsdl.resource}}
            </publishWSDL>
            {{/wsdlEnabled}}
            {{#enableAddressing}}
            <enableAddressing/>
            {{/enableAddressing}}
            {{#enableSec}}
            <enableSec/>
            {{/enableSec}}
            {{#policies}}
            <policy key="{{key}}"/>
            {{/policies}}
            {{#parameters}}
            <parameter name="{{name}}">{{textNode}}</parameter>
            {{/parameters}}
            `
        default:
            return ""                
    }
}


