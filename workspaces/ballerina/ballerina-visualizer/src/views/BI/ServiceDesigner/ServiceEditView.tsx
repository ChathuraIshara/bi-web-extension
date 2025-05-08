/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from 'react';
import { ServiceModel, NodePosition, LineRange, ListenerModel } from '@wso2-enterprise/ballerina-core';
import { Typography, ProgressRing, View, ViewContent } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import ServiceConfigForm from './Forms/ServiceConfigForm';
import { LoadingContainer } from '../../styles';
import { TitleBar } from '../../../components/TitleBar';
import { TopNavigationBar } from '../../../components/TopNavigationBar';
import ListenerConfigForm from './Forms/ListenerConfigForm';

const FORM_WIDTH = 600;

const FormContainer = styled.div`
    padding-top: 15px;
    padding-bottom: 15px;
`;


const ContainerX = styled.div`
    padding: 0 20px 20px;
    max-width: 600px;
    > div:last-child {
        padding: 20px 0;
        > div:last-child {
            justify-content: flex-start;
        }
    }
`;

const Container = styled.div`
    display: "flex";
    flex-direction: "column";
    gap: 10;
    margin: 0 20px 20px 0;
`;

const BottomMarginTextWrapper = styled.div`
    margin-top: 20px;
    margin-left: 20px;
    font-size: 15px;
    margin-bottom: 10px;
`;

const HorizontalCardContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const IconWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ButtonWrapper = styled.div`
    max-width: 600px;
    display: flex;
    gap: 10px;
    justify-content: right;
`;


export interface ServiceEditViewProps {
    filePath: string;
    position: NodePosition;
}

export function ServiceEditView(props: ServiceEditViewProps) {
    const { filePath, position } = props;
    const { rpcClient } = useRpcContext();
    const [serviceModel, setServiceModel] = useState<ServiceModel>(undefined);
    const [listenerModel, setListenerModel] = useState<ListenerModel>(undefined);

    const [saving, setSaving] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);

    useEffect(() => {
        const lineRange: LineRange = { startLine: { line: position.startLine, offset: position.startColumn }, endLine: { line: position.endLine, offset: position.endColumn } };
        rpcClient.getServiceDesignerRpcClient().getServiceModelFromCode({ filePath, codedata: { lineRange } }).then(res => {
            setServiceModel(res.service);
            rpcClient.getServiceDesignerRpcClient().getListenerModel({ moduleName: res.service.moduleName }).then(res => {
                console.log("Listener Model: ", res);
                setListenerModel(res.listener);
            });
        })
    }, []);

    const onSubmit = async (value: ServiceModel) => {
        setSaving(true);
        const res = await rpcClient.getServiceDesignerRpcClient().updateServiceSourceCode({ filePath, service: value });
    }

    const handleListenerSubmit = async (value?: ListenerModel) => {
        setSaving(true);
        let listenerName;
        if (value) {
            await rpcClient.getServiceDesignerRpcClient().addListenerSourceCode({ filePath: "", listener: value });
            if (value.properties['name'].value) {
                listenerName = value.properties['name'].value;
                serviceModel.properties['listener'].value = listenerName;
                serviceModel.properties['listener'].items.push(listenerName);
                setServiceModel({ ...serviceModel, properties: { ...serviceModel.properties } });
                setSaving(false);
                setStep(1);
            }
        }
    };

    const onBack = () => {
        setStep(1);
    }

    const openListenerForm = () => {
        setStep(0);
    }

    return (
        <View>
            <TopNavigationBar />
            <TitleBar title="Service" subtitle="Edit Service" />
            <ViewContent padding>
                {!serviceModel &&
                    <LoadingContainer>
                        <ProgressRing />
                        <Typography variant="h3" sx={{ marginTop: '16px' }}>Loading...</Typography>
                    </LoadingContainer>
                }
                {serviceModel &&
                    <Container>
                        {step === 0 &&
                            <>
                                <ListenerConfigForm listenerModel={listenerModel} onSubmit={handleListenerSubmit} onBack={onBack} formSubmitText={saving ? "Creating" : "Create"} isSaving={saving} />
                            </>
                        }
                        {step === 1 &&
                            <>
                                <ServiceConfigForm serviceModel={serviceModel} onSubmit={onSubmit} openListenerForm={openListenerForm} formSubmitText={saving ? "Saving" : "Save"} isSaving={saving} />
                            </>
                        }
                    </Container>
                }
            </ViewContent>
        </View >


    );
};
