/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useEffect, useState } from 'react';
import { EVENT_TYPE, ListenerModel, ListenersResponse, ServiceModel } from '@wso2-enterprise/ballerina-core';
import { Stepper, View, ViewContent } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import ListenerConfigForm from './Forms/ListenerConfigForm';
import ServiceConfigForm from './Forms/ServiceConfigForm';
import { LoadingContainer, LoadingOverlayContainer } from '../../styles';
import { TitleBar } from '../../../components/TitleBar';
import { TopNavigationBar } from '../../../components/TopNavigationBar';
import { LoadingRing } from '../../../components/Loader';
import { isBetaModule } from '../ComponentListView/componentListUtils';

const Container = styled.div`
    display: "flex";
    flex-direction: "column";
    gap: 10;
    margin: 20px;
`;

const StepperContainer = styled.div`
    margin-top: 16px;
    margin-left: 16px;
    margin-bottom: 20px;
`;

interface WizardHeaderInfo {
    title: string;
    moduleName: string;
}

export interface ServiceWizardProps {
    type: string;
}

export function ServiceWizard(props: ServiceWizardProps) {
    const { type } = props;
    const { rpcClient } = useRpcContext();

    const [step, setStep] = useState<number>(0);

    const [headerInfo, setHeaderInfo] = useState<WizardHeaderInfo>(undefined);
    const [listenerModel, setListenerModel] = useState<ListenerModel>(undefined);
    const [serviceModel, setServiceModel] = useState<ServiceModel>(undefined);
    const [listeners, setListeners] = useState<ListenersResponse>(undefined);

    const [existing, setExisting] = useState<boolean>(false);
    const [creatingListener, setCreatingListener] = useState<boolean>(false);

    const [saving, setSaving] = useState<boolean>(false);
    const [existingListener, setExistingListener] = useState<string>(undefined);
    const [pullingModules, setPullingModules] = useState<boolean>(false);

    useEffect(() => {
        rpcClient.getServiceDesignerRpcClient()
            .getServiceModel({ filePath: "", moduleName: type, listenerName: "" })
            .then(res => {
                setHeaderInfo({
                    title: res.service.displayName || res.service.name,
                    moduleName: res.service.moduleName
                });
            });
        rpcClient.getServiceDesignerRpcClient().getListeners({ filePath: "", moduleName: type }).then(res => {
            console.log("Existing Listeners: ", res);
            setExisting(res.hasListeners);
            if (res.hasListeners) {
                rpcClient.getServiceDesignerRpcClient().getServiceModel({ filePath: "", moduleName: type, listenerName: "" }).then(res => {
                    console.log("Service Model: ", res);
                    res.service.properties["listener"].editable = true;
                    setServiceModel(res.service);
                    setStep(1);
                });
            }
            setListeners(res);
        });
        rpcClient.getServiceDesignerRpcClient().getListenerModel({ moduleName: type }).then(res => {
            console.log("Listener Model: ", res);
            setListenerModel(res.listener);
        });
    }, []);

    const handleListenerSubmit = async (value?: ListenerModel) => {
        setSaving(true);
        let listenerName;
        if (value) {
            // Set a timeout to show step 2 after 3 seconds
            const timeoutId = setTimeout(() => {
                setPullingModules(true);
            }, 3000);
            await rpcClient.getServiceDesignerRpcClient().addListenerSourceCode({ filePath: "", listener: value });
            // Clear the timeout if the operation completed before 3 seconds
            clearTimeout(timeoutId);
            setPullingModules(false);
            if (value.properties['name'].value) {
                listenerName = value.properties['name'].value;
            }
        }
        if (!value && existing) {
            listenerName = existingListener;
        }
        rpcClient.getServiceDesignerRpcClient().getServiceModel({ filePath: "", moduleName: type, listenerName }).then(res => {
            console.log("Service Model: ", res);
            if (existing) {
                res.service.properties["listener"].editable = true;
            }
            setServiceModel(res.service);
            setSaving(false);
            setStep(1);
        });
    };

    const handleServiceSubmit = async (value: ServiceModel) => {
        setSaving(true);
        const res = await rpcClient.getServiceDesignerRpcClient().addServiceSourceCode({ filePath: "", service: value });
    }

    const onBack = () => {
        setStep(1);
    }

    const openListenerForm = () => {
        setCreatingListener(true);
        setStep(0);
    }

    const onListenerSelect = (value: string) => {
        setExistingListener(value);
    }

    const defaultSteps = ["Listener Configuration", "Service Configuration"];

    return (
        <View>
            <TopNavigationBar />
            {headerInfo && (
                <TitleBar
                    title={headerInfo.title}
                    isBetaFeature={isBetaModule(headerInfo.moduleName)}
                />
            )}
            <ViewContent>
                {!listenerModel && !listeners &&
                    <LoadingContainer>
                        <LoadingRing message="Loading listener..." />
                    </LoadingContainer>
                }
                {listenerModel &&
                    <Container>
                        {!listeners?.hasListeners &&
                            <StepperContainer>
                                <Stepper alignment='flex-start' steps={defaultSteps} currentStep={step} />
                            </StepperContainer>
                        }
                        {step === 0 &&
                            <>
                                <ListenerConfigForm listenerModel={listenerModel} onSubmit={handleListenerSubmit} onBack={creatingListener && onBack} formSubmitText={saving ? "Creating" : (listeners?.hasListeners ? "Create" : undefined)} isSaving={saving} />
                            </>
                        }
                        {step === 1 &&
                            <>
                                <ServiceConfigForm serviceModel={serviceModel} onSubmit={handleServiceSubmit} openListenerForm={existing && openListenerForm} formSubmitText={saving ? "Creating" : "Create"} isSaving={saving} />
                            </>
                        }
                        {pullingModules &&
                            <LoadingOverlayContainer>
                                <LoadingRing message="Pulling the required modules..." />
                            </LoadingOverlayContainer>
                        }
                    </Container>
                }
            </ViewContent>
        </View >


    );
};
