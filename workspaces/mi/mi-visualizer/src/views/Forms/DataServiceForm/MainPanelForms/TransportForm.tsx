/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import React, { Dispatch, SetStateAction } from "react";
import {TextField, FormCheckBox} from "@wso2-enterprise/ui-toolkit";
import {DataServicePropertyTable} from "./PropertyTable";

const CheckBoxContainer = styled.div`
    display  : flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
    padding-bottom: 5px;
`;

export interface DataServiceTransportWizardProps {
    authProperties: any;
    setAuthProperties: Dispatch<SetStateAction<any>>;
    renderProps: any;
    control: any;
    setValue?: any;
}

export function DataServiceTransportWizard(props: DataServiceTransportWizardProps) {

    const transportTypes = [
        'http',
        'https',
        'jms',
        'local'
    ];

    return (
        <>
            <span>Select the Transports:</span>
            <CheckBoxContainer>
                {transportTypes.map(transportType => (
                    <FormCheckBox
                        label={transportType}
                        control={props.control}
                        {...props.renderProps(transportType)}
                    />
                ))}
            </CheckBoxContainer>
            <TextField
                label="Transaction Manager JNDI Name"
                size={100}
                {...props.renderProps('jndiName')}
            />
            <TextField
                label="Authorization Provider Class"
                size={100}
                {...props.renderProps('authProviderClass')}
            />
            <DataServicePropertyTable setProperties={props.setAuthProperties} properties={props.authProperties} type={'transport'} setValue={props.setValue} />
        </>
    );
}
