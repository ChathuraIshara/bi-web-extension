/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import Mustache from "mustache";
import { TestCaseEntry } from "../../../views/Forms/Tests/TestCaseForm";

export function getTestSuiteXML(data: any) {
    data.testCases = data.testCases.map((testCase: TestCaseEntry) => {
        return modityTestCaseData(testCase);
    });
    return Mustache.render(getTestSuiteMustacheTemplate(), data);
}

function modityTestCaseData(data: TestCaseEntry) {
    if (data.input.payload && data.input.payload.startsWith("<![CDATA[")) {
        data.input.payload = data.input.payload.substring(9, data.input.payload.length - 3);
    }
    if (data?.input?.properties) {
        if (
            (Array.isArray(data.input.properties) &&
                data.input.properties.length === 0) ||
            data.input.properties === undefined
        ) {
            delete data.input.properties;
        } else {
            (data.input.properties as any) = data.input.properties.map((property: any) => {
                return {
                    name: property[0],
                    scope: property[1],
                    value: property[2]
                }
            });
        }
    }
    const assertions = data.assertions.map((assertion: string[]) => {
        // replace spaces and join camel case
        let type = assertion[0].replace(/\s/g, '').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        // make first char lowercase
        type = type.charAt(0).toLowerCase() + type.slice(1);
        const expression = assertion[1];

        let expectedValue;
        let errorMessage;
        if (Object.keys(assertion).length > 3) {
            expectedValue = assertion[2];
            errorMessage = assertion[3];

            if (expectedValue?.startsWith("<![CDATA[")) {
                expectedValue = expectedValue.substring(9, expectedValue.length - 3);
            }
        } else {
            errorMessage = assertion[2];
        }

        return {
            type,
            expression,
            ...(expectedValue) && { expectedValue },
            errorMessage
        }
    });

    return {
        ...data,
        assertions
    }
}
export function getTestCaseXML(data: any) {
    const modifiedData = modityTestCaseData(data);
    return Mustache.render(getTestCaseMustacheTemplate(), modifiedData);
}

export function getMockServiceXML(data: any) {
    return Mustache.render(getMockServiceMustacheTemplate(), data);
}

function getTestSuiteMustacheTemplate() {
    return `<unit-test>
    <artifacts>
        <test-artifact>
            <artifact>{{{artifact}}}</artifact>
        </test-artifact>
        <supportive-artifacts>
            {{#supportiveArtifacts}}
            <artifact>{{{.}}}</artifact>
            {{/supportiveArtifacts}}
        </supportive-artifacts>
        <registry-resources>
            {{#registryResources}}
            <registry-resource>
                <file-name>{{fileName}}</file-name>
                <artifact>{{artifact}}</artifact>
                <registry-path>{{registryPath}}</registry-path>
                <media-type>{{mediaType}}</media-type>
            </registry-resource>
            {{/registryResources}}
        </registry-resources>
    </artifacts>
    <test-cases>
        {{#testCases}}
        ${getTestCaseMustacheTemplate()}
        {{/testCases}}
    </test-cases>
    <mock-services>
        {{#mockServices}}
        <mock-service>{{{.}}}</mock-service>
        {{/mockServices}}
    </mock-services>
</unit-test>`;
}

function getTestCaseMustacheTemplate() {
    return `<test-case name="{{name}}">
            <input>{{#input.requestPath}}
                <request-path>{{{input.requestPath}}}</request-path>{{/input.requestPath}}{{#input.requestMethod}}
                <request-method>{{input.requestMethod}}</request-method>{{/input.requestMethod}}{{#input.requestProtocol}}
                <request-protocol>{{input.requestProtocol}}</request-protocol>{{/input.requestProtocol}}{{#input.payload}}
                <payload><![CDATA[{{{input.payload}}}]]></payload>{{/input.payload}}{{#input.properties.length}}
                <properties>
                    {{#input.properties}}
                    <property name="{{name}}" scope="{{scope}}" value="{{value}}" />
                    {{/input.properties}}
                </properties>{{/input.properties.length}}
            </input>
            <assertions>
                {{#assertions}}
                <{{type}}>
                    <actual>{{expression}}</actual>{{#expectedValue}}
                    <expected><![CDATA[{{{expectedValue}}}]]></expected>{{/expectedValue}}
                    <message>{{errorMessage}}</message>
                </{{type}}>
                {{/assertions}}    
            </assertions>
        </test-case>
    `;
}

function getMockServiceMustacheTemplate() {
    return `<mock-service>
    <service-name>{{endpointName}}</service-name>
    <port>{{servicePort}}</port>
    <context>{{{serviceContext}}}</context>
    <resources>
        {{#resources}}
        <resource>
            <sub-context>{{{subContext}}}</sub-context>
            <method>{{method}}</method>
            {{#request}}
            <request>
                <headers>
                    {{#headers}}
                    <header name="{{name}}" value="{{value}}" />
                    {{/headers}}
                </headers>
                {{#payload}}
                <payload>
                    <![CDATA[{{{payload}}}]]>
                </payload>
                {{/payload}}
            </request>
            {{/request}}
            {{#response}}
            <response>
                <status-code>{{statusCode}}</status-code>
                <headers>
                    {{#headers}}
                    <header name="{{name}}" value="{{value}}" />
                    {{/headers}}
                </headers>
                {{#payload}}
                <payload>
                    <![CDATA[{{{payload}}}]]>
                </payload>
                {{/payload}}
            </response>
            {{/response}}
        </resource>
        {{/resources}}
    </resources>
</mock-service>`;
}
