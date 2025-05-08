/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { TextField, Dropdown, RadioButtonGroup } from "@wso2-enterprise/ui-toolkit";

export interface DataSourceMongoDBFormProps {
    renderProps: any;
}

interface OptionProps {
    value: string;
}

export function DataSourceMongoDBForm(props: DataSourceMongoDBFormProps) {

    const mongodbAuthenticationMethods: OptionProps[] = [
        { value: "SCRAM-SHA-1"},
        { value: "MONDODB-CR"},
        { value: "MONDODB-X509"},
        { value: "GSSAPI"},
        { value: "PLAIN"}
    ];

    const writeConcernTypes: OptionProps[] = [
        { value: "ACKNOWLEDGED"},
        { value: "JOURNALED"},
        { value: "MAJORITY"},
        { value: "UNACKNOWLEDGED"},
        { value: "W1"},
        { value: "W2"},
        { value: "W3"}
    ];

    return (
        <>
            <TextField
                label="Servers"
                required
                size={100}
                {...props.renderProps('mongodb.mongoDB_servers')}
            />
            <TextField
                label="Database Name"
                required
                size={100}
                {...props.renderProps('mongodb.mongoDB_database')}
            />
            <TextField
                label="Username"
                size={100}
                {...props.renderProps('mongodb.username')}
            />
            <TextField
                label="Password"
                size={100}
                {...props.renderProps('mongodb.password')}
            />
            <TextField
                label="Authentication Source"
                size={100}
                {...props.renderProps('mongodb.mongoDB_auth_source')}
            />
            <TextField
                label="Connection Timeout"
                size={100}
                {...props.renderProps('mongodb.mongoDB_connectTimeout')}
            />
            <TextField
                label="Max Wait Time"
                size={100}
                {...props.renderProps('mongodb.mongoDB_maxWaitTime')}
            />
            <TextField
                label="Socket Timeout"
                size={100}
                {...props.renderProps('mongodb.mongoDB_socketTimeout')}
            />
            <TextField
                label="Connections per Host"
                size={100}
                {...props.renderProps('mongodb.mongoDB_socketTimeout')}
            />
            <TextField
                label="Threads Allowed to Block for Connection Multiplier"
                size={100}
                {...props.renderProps('mongodb.mongoDB_threadsAllowedToBlockForConnectionMultiplier')}
            />
            <Dropdown label="Authentication Method" items={mongodbAuthenticationMethods} {...props.renderProps('mongodb.mongoDB_authentication_type')}/>
            <Dropdown label="Write Concern" items={writeConcernTypes}  {...props.renderProps('mongodb.mongoDB_write_concern')}/>
            <RadioButtonGroup
                label="Read Preference"
                options={[{ content: "PRIMARY", value: "PRIMARY" }, {content: "SECONDARY", value: "SECONDARY"}]}
                {...props.renderProps('mongodb.mongoDB_read_preference')}
            />
            <RadioButtonGroup
                label="SSL Enabled"
                options={[{ content: "True", value: "true" }, {content: "False", value: "false"}]}
                {...props.renderProps('mongodb.mongoDB_ssl_enabled')}
            />
        </>
    );
}
