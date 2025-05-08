/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { FormCheckBox, TextField } from "@wso2-enterprise/ui-toolkit";

export interface DataServiceAdvancedWizardProps {
    renderProps: any;
    control: any;
}

export function DataServiceAdvancedWizard(props: DataServiceAdvancedWizardProps) {

    return (
        <>
            <TextField
                label="Data Service Group"
                size={100}
                {...props.renderProps('serviceGroup')}
            />
            <TextField
                label="Data Service Namespace"
                size={100}
                {...props.renderProps('dataServiceNamespace')}
            />
            <TextField
                label="Publish Swagger"
                size={100}
                {...props.renderProps('publishSwagger')}
            />
            <FormCheckBox
                label="Enable Batch Requests"
                control={props.control}
                {...props.renderProps('enableBatchRequests')}
            />
            <FormCheckBox
                label="Enable Boxcarring"
                control={props.control}
                {...props.renderProps('enableBoxcarring')}
            />
            <FormCheckBox
                label="Disable Legacy Boxcarrying Mode"
                control={props.control}
                {...props.renderProps('disableLegacyBoxcarringMode')}
            />
            <FormCheckBox
                label="Enable Streaming"
                control={props.control}
                {...props.renderProps('enableStreaming')}
            />
            <FormCheckBox
                label="Active Service Status"
                control={props.control}
                {...props.renderProps('serviceStatus')}
            />
        </>
    );
}
