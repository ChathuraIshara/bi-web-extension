/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-console jsx-wrap-multiline
import React, { useContext, useEffect, useState } from "react";

import {
    BallerinaConnectorInfo,
    ConnectorWizardProps,
    ConnectorWizardType,
    FunctionDefinitionInfo,
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { LocalVarDecl, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../Contexts/Diagram";
import { ConnectorConfigWizard } from "../../ConnectorConfigWizard";
import { FormGenerator } from "../../FormGenerator";
import { isStatementEditorSupported } from "../../Utils";

import { fetchConnectorInfo, getConnectorImports } from "./util";


enum WizardStep {
    EMPTY = "empty",
    MARKETPLACE = "marketplace",
    ENDPOINT_FORM = "endpointForm",
    ENDPOINT_LIST = "endpointList",
    ACTION_LIST = "actionList",
    ACTION_FROM = "actionFrom",
}

export function ConnectorWizard(props: ConnectorWizardProps) {
    const {
        props: { langServerURL, currentFile, ballerinaVersion, fullST },
        api: {
            ls: { getDiagramEditorLangClient },
            runBackgroundTerminalCommand,
        },
    } = useContext(Context);

    const {
        wizardType,
        connectorInfo,
        model,
        targetPosition,
        functionNode,
        diagramPosition,
        isModuleType,
        onSave,
        onClose,
    } = props;

    const [fetchingMetadata, setFetchingMetadata] = useState(false);
    const [retrievingAction, setRetrievingAction] = useState(false);
    const [selectedConnector, setSelectedConnector] = useState<BallerinaConnectorInfo>(connectorInfo);
    const [selectedEndpoint, setSelectedEndpoint] = useState<string>();
    const [selectedAction, setSelectedAction] = useState<FunctionDefinitionInfo>();
    const [isClassField, setIsClassField] = useState(false);
    const [wizardStep, setWizardStep] = useState<string>(getInitialWizardStep());
    const [pullingPackage, setPullingPackage] = useState(false);

    const showNewForms = isStatementEditorSupported(ballerinaVersion);
    const isLoading = fetchingMetadata || retrievingAction || pullingPackage;
    const isHttp = selectedConnector?.moduleName === "http";

    useEffect(() => {
        setWizardStep(getInitialWizardStep());
    }, [wizardType]);

    useEffect(() => {
        (async () => {
            await retrieveMissingInfo();
        })();
    }, [wizardStep]);

    useEffect(() => {
        retrieveMissingInfo();
    }, [connectorInfo]);

    useEffect(() => {
        if (
            wizardType === ConnectorWizardType.ENDPOINT &&
            !pullingPackage &&
            !model &&
            selectedConnector?.package?.organization &&
            selectedConnector.package.name
        ) {
            setPullingPackage(true);
            const imports = getConnectorImports(fullST, selectedConnector.package.organization, selectedConnector.moduleName, true);
            if (imports && imports?.size > 0) {
                let pullCommand = "";
                imports.forEach((impt) => {
                    if (pullCommand !== "") {
                        pullCommand += ` && `;
                    }
                    pullCommand += `bal pull ${impt.replace(" as _", "")}`;
                });
                runBackgroundTerminalCommand(pullCommand)
                    .then((res) => {
                        if (res.error && !res.message.includes("already exists")) {
                            // TODO: Handle error properly
                            console.error('Something wrong when pulling package: ', res.message);
                        }
                    })
                    .catch((err) => {
                        // TODO: Handle error properly
                        console.error('Something wrong when pulling package: ', err);
                    })
                    .finally(() => {
                        setPullingPackage(false);
                    });
            }
        }
    }, [selectedConnector]);

    function getInitialWizardStep() {
        if (wizardType === ConnectorWizardType.ENDPOINT) {
            return model ? WizardStep.ENDPOINT_FORM : WizardStep.MARKETPLACE;
        } else if (wizardType === ConnectorWizardType.ACTION) {
            return model ? WizardStep.ACTION_FROM : WizardStep.ENDPOINT_LIST;
        }
    }

    async function retrieveMissingInfo() {
        if (model && connectorInfo) {
            if (
                wizardStep === WizardStep.ENDPOINT_FORM &&
                (!selectedConnector || !hasFunctions(selectedConnector)) &&
                !fetchingMetadata
            ) {
                await retrieveUsedConnector(connectorInfo);
            } else if (wizardStep === WizardStep.ACTION_FROM && !selectedAction && !retrievingAction) {
                await retrieveUsedAction(model, connectorInfo);
            }
        }
    }

    async function retrieveUsedConnector(connector: BallerinaConnectorInfo) {
        if (hasFunctions(connector)) {
            return;
        }
        setFetchingMetadata(true);
        const metadata = await fetchMetadata(connector);
        if (!metadata) {
            // TODO: Handle error properly
            setWizardStep(WizardStep.EMPTY);
            onClose();
        }
        setFetchingMetadata(false);
    }

    async function retrieveUsedAction(actionModel: STNode, connector?: BallerinaConnectorInfo) {
        let methodName = "";
        let methods = connector.functions;

        setRetrievingAction(true);
        if (!hasFunctions(connector)) {
            const metadata = await fetchMetadata(connector);
            methods = metadata ? metadata.functions : undefined;
        }

        if (
            STKindChecker.isLocalVarDecl(actionModel) &&
            STKindChecker.isCheckAction(actionModel.initializer) &&
            // TODO: replace with STKindchecker checks once the syntax tree is updated
            (STKindChecker.isRemoteMethodCallAction(actionModel.initializer.expression)
                || actionModel.initializer.expression.kind === 'ClientResourceAccessAction')
        ) {
            if ((actionModel.initializer.expression as any).methodName) {
                methodName = (actionModel.initializer.expression as any)?.methodName.name.value;
            } else if (connector && connector.moduleName === 'http') {
                methodName = 'get';
            }
        } else if (
            STKindChecker.isLocalVarDecl(actionModel) &&
            (STKindChecker.isRemoteMethodCallAction(actionModel.initializer)
                || actionModel.initializer.kind === 'ClientResourceAccessAction')
        ) {
            if ((actionModel.initializer as any).methodName) {
                methodName = (actionModel.initializer as any)?.methodName.name.value;
            } else {
                if (connector && connector.moduleName === 'http') {
                    methodName = 'get';
                }
            }

        } else if (
            STKindChecker.isActionStatement(actionModel) &&
            STKindChecker.isCheckAction(actionModel.expression) &&
            STKindChecker.isRemoteMethodCallAction(actionModel.expression.expression)
        ) {
            methodName = actionModel.expression.expression.methodName.name.value;
        }
        if (methodName && methodName !== "" && methods?.length > 0) {
            const usedMethod = methods.find((func) => func.name === methodName);
            if (usedMethod) {
                setSelectedAction(usedMethod);
                setRetrievingAction(false);
                return;
            }
        }
        // TODO: Handle error properly
        setWizardStep(WizardStep.EMPTY);
        setRetrievingAction(false);
        onClose();
    }

    async function fetchMetadata(connector: BallerinaConnectorInfo): Promise<BallerinaConnectorInfo> {
        const connectorMetadata = await fetchConnectorInfo(
            connector,
            langServerURL,
            currentFile.path,
            getDiagramEditorLangClient
        );
        if (connectorMetadata) {
            setSelectedConnector(connectorMetadata);
        }
        return connectorMetadata;
    }

    async function handleSelectConnector(connector: BallerinaConnectorInfo, node: LocalVarDecl) {
        setFetchingMetadata(true);
        setSelectedConnector(connector);
        setWizardStep(WizardStep.ENDPOINT_FORM);
        await fetchMetadata(connector);
        setFetchingMetadata(false);
    }

    async function handleSelectEndpoint(connector: BallerinaConnectorInfo, endpointName: string, classField?: boolean) {
        setSelectedEndpoint(endpointName);
        setWizardStep(WizardStep.ACTION_LIST);
        if (!hasFunctions(connectorInfo)) {
            setFetchingMetadata(true);
            setIsClassField(classField ?? false);
            await fetchMetadata(connector);
        }
        setFetchingMetadata(false);
    }

    function closeEndpointForm() {
        onClose();
        setSelectedConnector(undefined);
    }

    function saveEndpointForm() {
        onSave();
        closeEndpointForm();
    }

    function handleAddNewEndpoint() {
        setSelectedConnector(undefined);
        setSelectedAction(undefined);
        setWizardStep(WizardStep.MARKETPLACE);
    }

    function handleSelectAction(action: FunctionDefinitionInfo) {
        setSelectedAction(action);
        setWizardStep(WizardStep.ACTION_FROM);
    }

    function handleActionBack() {
        setWizardStep(WizardStep.ENDPOINT_LIST);
    }

    function hasFunctions(connector: BallerinaConnectorInfo) {
        return connector?.functions?.length > 0 ?? false;
    }

    return (
        <>
            {pullingPackage && (wizardStep === WizardStep.ENDPOINT_FORM || wizardStep === WizardStep.ACTION_FROM) && (
                <FormGenerator
                    onCancel={onClose}
                    configOverlayFormStatus={{
                        formType: "PackageLoader",
                        formArgs: {},
                        isLoading,
                    }}
                />
            )}
            {wizardStep === WizardStep.MARKETPLACE && (
                <FormGenerator
                    onCancel={onClose}
                    configOverlayFormStatus={{
                        formType: "ConnectorList",
                        formArgs: {
                            onSelect: handleSelectConnector,
                            onCancel: onClose,
                        },
                        isLoading,
                    }}
                />
            )}
            {wizardStep === WizardStep.ENDPOINT_FORM &&
                (selectedConnector?.package || connectorInfo?.package) &&
                showNewForms && !pullingPackage && (
                    <FormGenerator
                        onCancel={closeEndpointForm}
                        onSave={saveEndpointForm}
                        configOverlayFormStatus={{
                            formType: "EndpointForm",
                            formArgs: {
                                connector: selectedConnector?.package ? selectedConnector : connectorInfo,
                                functionNode,
                            },
                            isLoading,
                        }}
                        targetPosition={targetPosition}
                        model={model}
                        showLoader={true}
                    />
                )}
            {wizardStep === WizardStep.ENDPOINT_FORM &&
                (selectedConnector?.package || connectorInfo?.package) &&
                !showNewForms && !pullingPackage && (
                    // TODO: Remove this when cleaning old forms
                    <ConnectorConfigWizard
                        position={diagramPosition}
                        connectorInfo={selectedConnector?.package ? selectedConnector : connectorInfo}
                        targetPosition={targetPosition}
                        model={model}
                        onClose={closeEndpointForm}
                        onSave={saveEndpointForm}
                        isModuleEndpoint={isModuleType ?? false}
                        isAction={false}
                        isEdit={model ? true : false}
                        functionNode={functionNode}
                        isLoading={isLoading}
                    />
                )}
            {wizardStep === WizardStep.ENDPOINT_LIST && (
                <FormGenerator
                    onCancel={onClose}
                    configOverlayFormStatus={{
                        formType: "EndpointList",
                        formArgs: {
                            onSelect: handleSelectEndpoint,
                            functionNode,
                            addNewEndpoint: handleAddNewEndpoint,
                        },
                        isLoading,
                    }}
                    targetPosition={targetPosition}
                    model={model}
                />
            )}
            {wizardStep === WizardStep.ACTION_LIST && showNewForms && (
                <FormGenerator
                    onCancel={onClose}
                    onBack={handleActionBack}
                    configOverlayFormStatus={{
                        formType: "ActionList",
                        formArgs: {
                            actions: selectedConnector?.functions,
                            onSelect: handleSelectAction,
                            isHttp
                        },
                        isLoading,
                    }}
                />
            )}
            {wizardStep === WizardStep.ACTION_LIST && !showNewForms && (
                // TODO: Remove this when cleaning old forms
                <ConnectorConfigWizard
                    position={diagramPosition}
                    connectorInfo={selectedConnector}
                    endpointName={selectedEndpoint}
                    targetPosition={targetPosition}
                    model={model}
                    onClose={closeEndpointForm}
                    onSave={saveEndpointForm}
                    isModuleEndpoint={isModuleType ?? false}
                    isAction={true}
                    isEdit={model ? true : false}
                    functionNode={functionNode}
                    isLoading={isLoading}
                />
            )}
            {wizardStep === WizardStep.ACTION_FROM && !pullingPackage && (
                <FormGenerator
                    onCancel={onClose}
                    onSave={onSave}
                    configOverlayFormStatus={{
                        formType: "ActionForm",
                        formArgs: {
                            action: selectedAction,
                            endpointName: selectedEndpoint,
                            isClassField,
                            functionNode,
                            isHttp,
                        },
                        isLoading,
                    }}
                    targetPosition={targetPosition}
                    model={model}
                    showLoader={true}
                />
            )}
        </>
    );
}

