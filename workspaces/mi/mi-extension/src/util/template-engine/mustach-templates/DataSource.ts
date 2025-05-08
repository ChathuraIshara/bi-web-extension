/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";
import { DataSourceTemplate } from "@wso2-enterprise/mi-core";

interface Parameter {
    [key: string]: string | number | boolean;
}

export interface DataSourceTemplateArgs {
    name: string;
    description?: string;
    customType?: string;
    customDefinition?: string;
    RDBMS?: {
        driver: string;
        url: string;
        username: string;
        password: string;
        dataSourceConfigParameters?: Parameter[];
        dataSourceClassName?: string;
        dataSourceProps?: Parameter[];
        hasDataSourceProps?: boolean;
        isExternal?: boolean;
    };
    jndi?: {
        useDataSourceFactory: boolean;
        jndiName: string;
        jndiProperties?: Parameter[];
        hasJndiProperties?: boolean;
    };
}

export function getDatasourceTemplate() {
    return `<datasource>
    <name>{{name}}</name>
    {{#description}}
    <description>{{description}}</description>
    {{/description}}
    {{#RDBMS}}
    {{#jndi}}
    <jndiConfig useDataSourceFactory="{{useDataSourceFactory}}">
        <name>{{jndiName}}</name>
        {{#hasJndiProperties}}
        <environment>
        {{#jndiProperties}}
        {{#key}}
            <property name="{{key}}">{{value}}</property>
        {{/key}}
        {{/jndiProperties}}
        </environment>
        {{/hasJndiProperties}}
    </jndiConfig>
    {{/jndi}}
    <definition type="RDBMS">
        <configuration>
            {{#dataSourceConfigParameters}}
            {{#key}}
            <{{key}}>{{value}}</{{key}}>
            {{/key}}
            {{/dataSourceConfigParameters}}
            {{#isExternal}}
            <dataSourceClassName>{{dataSourceClassName}}</dataSourceClassName>
            {{#hasDataSourceProps}}
            <dataSourceProps>
            {{#dataSourceProps}}
            {{#key}}
                <property name="{{key}}">{{value}}</property>
            {{/key}}
            {{/dataSourceProps}}
            </dataSourceProps>
            {{/hasDataSourceProps}}
            {{/isExternal}}
            {{^isExternal}}
            <driverClassName>{{driver}}</driverClassName>
            <url>{{url}}</url>
            <username>{{username}}</username>
            <password>{{password}}</password>
            {{/isExternal}}
        </configuration>
    </definition>
    {{/RDBMS}}{{^RDBMS}}
    <definition type="{{customType}}">
        {{{customDefinition}}}
    </definition>
    {{/RDBMS}}
</datasource>`;
}

export function getDataSourceXml(data: DataSourceTemplate) {
    const templateArgs: DataSourceTemplateArgs = {
        name: data.name,
        description: data.description ?? "",
    };
    if (data.type === "RDBMS") {
        templateArgs.RDBMS = {
            driver: data.driverClassName ?? "",
            url: data.url ?? "",
            username: data.username ?? "",
            password: data.password ?? "",
        };
        if (data.dataSourceConfigParameters) {
            let params: Parameter[] = [];
            Object.entries(data.dataSourceConfigParameters).map(([key, value]) => {
                params.push({ key, value });
            });
            templateArgs.RDBMS.dataSourceConfigParameters = params;
        }
        if (data.externalDSClassName) {
            templateArgs.RDBMS.isExternal = true;
            templateArgs.RDBMS.dataSourceClassName = data.externalDSClassName;
            if (data.dataSourceProperties) {
                let props: Parameter[] = [];
                Object.entries(data.dataSourceProperties).map(([key, value]) => {
                    props.push({ key, value });
                });
                templateArgs.RDBMS.dataSourceProps = props;
                templateArgs.RDBMS.hasDataSourceProps = props.length > 0;
            }
        }
    }
    if (data.jndiConfig && Object.keys(data.jndiConfig).length !== 0 && data.jndiConfig.JNDIConfigName !== "") {
        templateArgs.jndi = {
            useDataSourceFactory: data.jndiConfig.useDataSourceFactory,
            jndiName: data.jndiConfig.JNDIConfigName,
        };
        if (data.jndiConfig.properties) {
            let props: Parameter[] = [];
            Object.entries(data.jndiConfig.properties).map(([key, value]) => {
                props.push({ key, value });
            });
            templateArgs.jndi.jndiProperties = props;
            templateArgs.jndi.hasJndiProperties = props.length > 0;
        }
    }
    if (data.customDSConfiguration) {
        templateArgs.customDefinition = data.customDSConfiguration;
        templateArgs.customType = data.customDSType;
    }
    return render(getDatasourceTemplate(), templateArgs);
}
