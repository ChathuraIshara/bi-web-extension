/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState, useEffect } from "react";
import { ResourceForm } from "./components/ResourceForm/ResourceForm";
import { FunctionForm } from "./components/FunctionForm/FunctionForm";
import { ServiceDeclaration, NodePosition } from "@wso2-enterprise/syntax-tree";
import { ServiceView } from "./components/ServiceView/ServiceView";
import { getService, RPCClients, updateServiceDecl } from "./utils/utils";
import { ServiceForm } from "./components/ServiceForm/ServiceForm";
import { LineRange, STModification, TriggerFunction, TriggerNode } from "@wso2-enterprise/ballerina-core";
import { ContextProvider } from "./ContextProvider";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { Codicon, View, ViewHeader, ViewContent, Typography, ProgressRing, Divider, LinkButton, colors } from "@wso2-enterprise/ui-toolkit";
import styled from "@emotion/styled";
import { Resource, Service } from "./utils/definitions";

const ServiceHeader = styled.div`
    padding-left: 24px;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    flex-direction: column;
`;

const AccordionContainer = styled.div`
    margin-top: 10px;
    overflow: hidden;
    background-color: var(--vscode-editorHoverWidget-background);
    &:hover {
        background-color: var(--vscode-list-hoverBackground);
        cursor: pointer;
    }
`;

const AccordionHeader = styled.div`
    padding: 10px;
    cursor: pointer;
    display: grid;
    grid-template-columns: 3fr 1fr;
`;

const MethodSection = styled.div`
    display: flex;
    gap: 4px;
`;

const ButtonSection = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 6px;
`;

type MethodProp = {
    color: string;
    hasLeftMargin?: boolean;
};

const MethodBox = styled.div<MethodProp>`
    display: flex;
    justify-content: center;
    height: 25px;
    min-width: 70px;
    width: auto;
    margin-left: ${(p: MethodProp) => p.hasLeftMargin ? "10px" : "0px"};
    text-align: center;
    padding: 3px 5px 3px 5px;
    background-color: ${(p: MethodProp) => p.color};
    color: #FFF;
    align-items: center;
    font-weight: bold;
`;

const MethodPath = styled.span`
    align-self: center;
    margin-left: 10px;
`;

interface ServiceDesignerProps {
    // Model of the service. This is the ST of the service
    model?: ServiceDeclaration;
    // File path of the service
    serviceFilePath?: string;
    // RPC client to communicate with the backend for ballerina
    rpcClients?: RPCClients;
    // Callback to send modifications to update source
    applyModifications?: (modifications: STModification[]) => Promise<void>;
    // Callback to send the position of the resource to navigae to code
    goToSource?: (resource: Resource) => void;
    // If the service designer is for bi
    isBI?: boolean;
    // If editing needs to be disabled
    isEditingDisabled?: boolean;
    // Callback to open trigger form
    handleServiceConfig?: (triggerNode: TriggerNode) => void;
}

export function ServiceDesigner(props: ServiceDesignerProps) {
    const { model, serviceFilePath, rpcClients, applyModifications, goToSource, isEditingDisabled, handleServiceConfig } = props;

    const [serviceConfig, setServiceConfig] = useState<Service>();

    const [isResourceFormOpen, setResourceFormOpen] = useState<boolean>(false);
    const [isServiceFormOpen, setServiceFormOpen] = useState<boolean>(false);
    const [editingResource, setEditingResource] = useState<Resource>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isParentBallerinaExt = !goToSource;
    const serviceDesignerRpcClient = rpcClients?.serviceDesignerRpcClient;
    const commonRpcClient = rpcClients?.commonRpcClient;

    // Callbacks for resource form
    const handleResourceFormClose = () => {
        setResourceFormOpen(false);
        setIsLoading(false);
        setEditingResource(undefined);
    };
    const handleResourceFormOpen = () => {
        setResourceFormOpen(true);
    };
    const handleResourceEdit = async (resource: Resource) => {
        setEditingResource(resource);
        setResourceFormOpen(true);
    };
    const handleResourceDelete = async (resource: Resource) => {
        await applyModifications([{
            type: 'DELETE',
            ...resource.position
        }]);
    };
    const handleResourceFormSave = async (content: string, config: Resource, resourcePosition?: NodePosition) => {
        const position = model.closeBraceToken.position;
        position.endColumn = 0;
        await applyModifications([{
            type: "INSERT",
            isImport: false,
            config: {
                "STATEMENT": content
            },
            ...(resourcePosition ? resourcePosition : position)
        }]);
    };

    // Callbacks for service form
    const handleServiceEdit = () => {
        if (serviceConfig?.triggerModel) {
            handleServiceConfig(serviceConfig?.triggerModel);
        } else {
            setServiceFormOpen(true);

        }
    };
    const handleServiceFormClose = () => {
        setServiceFormOpen(false);
    };
    const handleServiceFormSave = async (service: Service) => {
        const content = updateServiceDecl({ BASE_PATH: service.path, PORT: `${service.port}`, SERVICE_TYPE: "http" });
        await applyModifications([{
            type: "INSERT",
            isImport: false,
            config: {
                "STATEMENT": content
            },
            ...service.position
        }]);
    };

    const handleGoToSource = (resource: Resource) => {
        if (goToSource) {
            goToSource(resource);
        } else {
            commonRpcClient.goToSource({ position: resource.position! });
        }
    };

    useEffect(() => {
        const fetchService = async () => {
            setServiceConfig(await getService(model, rpcClients, props.isBI, handleResourceEdit, handleResourceDelete, serviceFilePath));
        };
        fetchService();
    }, [model]);

    const addNameRecord = async (source: string) => {
        const position = model.closeBraceToken.position;
        position.startColumn = position.endColumn;
        await applyModifications([{
            type: "INSERT",
            isImport: false,
            config: {
                "STATEMENT": source
            },
            ...position
        }]);
    };

    const handleExportOAS = () => {
        serviceDesignerRpcClient.exportOASFile({});
    };

    const handleEnableFunction = async (triggerFunction: TriggerFunction) => {
        setIsLoading(true);
        const position: NodePosition = model.position;
        const lineRange: LineRange = { startLine: { line: position.startLine, offset: position.startColumn }, endLine: { line: position.endLine, offset: position.endColumn } };
        triggerFunction.enabled = true;
        if (editingResource) {
            await rpcClients.triggerWizardRpcClient.updateTriggerFunction({ filePath: serviceFilePath, function: triggerFunction, codedata: { lineRange } });
        } else {
            await rpcClients.triggerWizardRpcClient.addTriggerFunction({ filePath: serviceFilePath, function: triggerFunction, codedata: { lineRange } });
        }
        setIsLoading(false);
        setResourceFormOpen(false);
    };

    const triggerModel: TriggerNode = serviceConfig?.triggerModel;
    const name = serviceConfig?.path;
    const title = serviceConfig?.triggerModel ? `${serviceConfig?.triggerModel?.displayAnnotation.label} - ${name} Service` : `Service ${serviceConfig?.path}`;
    const showAddNew = serviceConfig?.triggerModel ? (triggerModel?.service?.functions?.some((func) => !func.enabled) || triggerModel.moduleName === "http") : !isEditingDisabled;

    return (
        <ContextProvider commonRpcClient={commonRpcClient} applyModifications={applyModifications} serviceEndPosition={model?.closeBraceToken.position}>
            {!serviceConfig &&
                <LoadingContainer>
                    <ProgressRing />
                    <Typography variant="h3" sx={{ marginTop: '16px' }}>Loading Service Designer...</Typography>
                </LoadingContainer>
            }
            {serviceConfig &&
                <div data-testid="service-design-view">
                    <View>
                        <ViewHeader title={title} codicon="globe" onEdit={!isEditingDisabled && handleServiceEdit}>
                            {showAddNew &&
                                <VSCodeButton appearance="primary" title="Add Resource" onClick={handleResourceFormOpen}>
                                    <Codicon name="add" sx={{ marginRight: 5 }} /> {serviceConfig?.triggerModel ? `Function` : 'Resource'}
                                </VSCodeButton>
                            }
                            {serviceConfig?.triggerModel.moduleName === "http" && <VSCodeButton appearance="secondary" title="Export OAS" onClick={handleExportOAS}>
                                <Codicon name="export" sx={{ marginRight: 5 }} /> Export OAS
                            </VSCodeButton>
                            }
                        </ViewHeader>
                        <ServiceHeader>
                            {/* {serviceConfig?.serviceType && <Typography sx={{ marginBlockEnd: 10 }} variant="h4">{serviceConfig?.serviceType}</Typography>} */}
                            {isEditingDisabled && <Typography sx={{ marginBlockEnd: 10 }} variant="caption">This is generated from {serviceConfig?.path} contract</Typography>}
                            {serviceConfig?.port && <Typography sx={{ marginBlockEnd: 10 }} variant="caption">Listening on: {serviceConfig.port}</Typography>}
                            {/* {serviceConfig?.listener && <Typography sx={{ marginBlockEnd: 10 }} variant="caption">Remote Endpoint: {serviceConfig.listener}</Typography>} */}
                        </ServiceHeader>
                        <ViewContent padding>
                            <ServiceView
                                customTitle={serviceConfig?.triggerModel && serviceConfig?.triggerModel.moduleName !== "http" ? `Available functions` : 'Available resources'}
                                customEmptyResourceMessage={serviceConfig?.triggerModel && "No functions found. Add a function."}
                                model={serviceConfig}
                                onResourceClick={handleGoToSource}
                                disableServiceHeader={props.isBI}
                                onResourceEdit={handleResourceEdit}
                                onResourceDelete={handleResourceDelete}
                            />
                            {/* {triggerModel?.service?.functions?.some((func) => !func.enabled) && <Divider />}
                            {(
                                triggerModel?.service.functions.filter((func) => !func.enabled).map((func, index) => (
                                    <AccordionContainer key={index}>
                                        <AccordionHeader>
                                            <MethodSection>
                                                <MethodBox color={colors.vscodeButtonSecondaryBackground}>
                                                    {func.kind.toLowerCase()}
                                                </MethodBox>
                                                <MethodPath>{func.name.value}</MethodPath>
                                            </MethodSection>
                                            <ButtonSection>
                                                <LinkButton sx={{ justifyContent: "center" }} onClick={() => handleEnableFunction(func)}>Add</LinkButton>
                                            </ButtonSection>
                                        </AccordionHeader>
                                    </AccordionContainer>
                                ))
                            )} */}
                            {/* {isLoading &&
                                <LoadingContainer>
                                    <ProgressRing />
                                    <Typography variant="h3" sx={{ marginTop: '16px' }}>Adding function..</Typography>
                                </LoadingContainer>
                            } */}
                        </ViewContent>
                    </View>
                    {isResourceFormOpen && serviceConfig?.triggerModel && serviceConfig?.triggerModel.moduleName === "http" &&
                        <ResourceForm
                            isOpen={isResourceFormOpen}
                            isBallerniaExt={isParentBallerinaExt}
                            resourceConfig={serviceConfig.resources.length > 0 ? editingResource : undefined}
                            onSave={handleResourceFormSave}
                            onClose={handleResourceFormClose}
                            addNameRecord={addNameRecord}
                            commonRpcClient={commonRpcClient}
                            applyModifications={applyModifications}
                        />
                    }
                    {isResourceFormOpen && serviceConfig?.triggerModel && serviceConfig?.triggerModel.moduleName !== "http" &&
                        <FunctionForm
                            isOpen={isResourceFormOpen}
                            triggerNode={triggerModel}
                            isBallerniaExt={isParentBallerinaExt}
                            resourceConfig={serviceConfig.resources.length > 0 ? editingResource : undefined}
                            onSave={handleEnableFunction}
                            onClose={handleResourceFormClose}
                            addNameRecord={addNameRecord}
                            commonRpcClient={commonRpcClient}
                            applyModifications={applyModifications}
                            isSaving={isLoading}
                        />
                    }
                    {isServiceFormOpen && serviceConfig?.triggerModel && serviceConfig?.triggerModel.moduleName === "http" &&
                        <ServiceForm
                            isOpen={isServiceFormOpen}
                            serviceConfig={serviceConfig}
                            onSave={handleServiceFormSave}
                            onClose={handleServiceFormClose}
                        />
                    }
                </div>
            }
        </ContextProvider >
    )
}
