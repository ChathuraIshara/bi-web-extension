/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useEffect, useState } from 'react';
import { ListenerModel } from '@wso2-enterprise/ballerina-core';
import { View, ViewContent, TextField, Button } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { LoadingContainer } from '../../styles';
import { TitleBar } from '../../../components/TitleBar';
import { TopNavigationBar } from '../../../components/TopNavigationBar';
import { LoadingRing } from '../../../components/Loader';
import { FormHeader } from '../../../components/FormHeader';

const FORM_WIDTH = 600;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 600px;
    gap: 20px;
`;

const Container = styled.div`
    display: "flex";
    flex-direction: "column";
    gap: 10;
`;


const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const FormFields = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
`;

export interface AIChatAgentWizardProps {
}

export function AIChatAgentWizard(props: AIChatAgentWizardProps) {
    // module name for ai agent
    const type = "ai";
    const { rpcClient } = useRpcContext();
    const [agentName, setAgentName] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");
    const [listenerModel, setListenerModel] = useState<ListenerModel>(undefined);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const steps = [
        { label: "Creating Agent", description: "Creating the AI chat agent" },
        { label: "Initializing", description: "Setting up the agent configuration" },
        { label: "Pulling Modules", description: "Pulling the required modules" },
        { label: "Creating Listener", description: "Configuring the service listener" },
        { label: "Creating Service", description: "Setting up the AI chat service" },
        { label: "Completing", description: "Finalizing the agent setup" }
    ];

    useEffect(() => {
        rpcClient.getServiceDesignerRpcClient().getListenerModel({ moduleName: type }).then(res => {
            setListenerModel(res.listener);
        });
    }, []);

    const validateName = (name: string): boolean => {
        if (!name) {
            setNameError("Name is required");
            return false;
        }
        if (/^[0-9]/.test(name)) {
            setNameError("Name cannot start with a number");
            return false;
        }
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
            setNameError("Name can only contain letters, numbers, and underscores");
            return false;
        }
        setNameError("");
        return true;
    };

    const handleCreateService = async () => {
        if (!validateName(agentName)) {
            return;
        }
        setIsCreating(true);
        try {
            setCurrentStep(0);
            // Update the listener name and create the listener
            const listener = listenerModel;
            const listenerName = agentName + "Listener";
            listener.properties['name'].value = listenerName;
            listener.properties['listenOn'].value = "check http:getDefaultListener()";

            setCurrentStep(1);
            // Set a timeout to show step 2 after 3 seconds
            const timeoutId = setTimeout(() => {
                setCurrentStep(2);
            }, 3000);
            await rpcClient.getServiceDesignerRpcClient().addListenerSourceCode({ filePath: "", listener });
            // Clear the timeout if the operation completed before 3 seconds
            clearTimeout(timeoutId);

            setCurrentStep(3);
            // Update the service name and create the service
            await rpcClient.getServiceDesignerRpcClient().getServiceModel({
                filePath: "",
                moduleName: type,
                listenerName: listenerName
            }).then(res => {
                const serviceModel = res.service;
                console.log("Service Model: ", serviceModel);
                serviceModel.properties["listener"].editable = true;
                serviceModel.properties["listener"].items = [listenerName];
                serviceModel.properties["listener"].values = [listenerName];
                serviceModel.properties["basePath"].value = `/${agentName}`;
                rpcClient.getServiceDesignerRpcClient().addServiceSourceCode({
                    filePath: "",
                    service: res.service
                }).then((res) => {
                    setCurrentStep(4);
                });
            });

            setCurrentStep(5);
        } catch (error) {
            console.error("Error creating AI Chat Agent:", error);
            setIsCreating(false);
            setCurrentStep(0);
        } finally {

        }
    }

    return (
        <View>
            <TopNavigationBar />
            <TitleBar
                title="AI Chat Agent"
                subtitle="Create a chattable AI agent using an LLM, prompts and tools."
            />
            <ViewContent padding>
                <Container>
                    {currentStep === 0 &&
                        <>
                            <FormHeader
                                title="Create AI Chat Agent"
                            />
                            <FormContainer>
                                <FormFields>
                                    <TextField
                                        label="Name"
                                        description="Name of the agent"
                                        value={agentName}
                                        onChange={(e) => {
                                            setAgentName(e.target.value);
                                            validateName(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isCreating && !nameError && agentName) {
                                                handleCreateService();
                                            }
                                        }}
                                        errorMsg={nameError}
                                        autoFocus
                                    />
                                    <ButtonContainer>
                                        <Button
                                            appearance="primary"
                                            onClick={handleCreateService}
                                            disabled={isCreating || !!nameError || !agentName}
                                        >
                                            {isCreating ? 'Creating...' : 'Create'}
                                        </Button>
                                    </ButtonContainer>
                                </FormFields>
                            </FormContainer>
                        </>
                    }
                    {currentStep !== 0 &&
                        <LoadingContainer>
                            <LoadingRing message={steps[currentStep].description} />
                        </LoadingContainer>
                    }
                </Container>
            </ViewContent>
        </View>
    );
};
