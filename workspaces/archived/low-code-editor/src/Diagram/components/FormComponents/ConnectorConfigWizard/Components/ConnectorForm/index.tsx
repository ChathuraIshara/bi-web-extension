/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
// tslint:disable: jsx-wrap-multiline
import React, { ReactNode, useContext, useEffect, useState } from "react";

import { Divider, FormControl, IconButton, Typography } from "@material-ui/core";
import { ModuleIcon } from "@wso2-enterprise/ballerina-low-code-diagram";
import {
    ActionConfig,
    BallerinaConnectorInfo,
    ConnectorConfig,
    FormField,
    genVariableName,
    getAllVariables,
    LowcodeEvent,
    SAVE_CONNECTOR,
    SAVE_CONNECTOR_INIT,
    SAVE_CONNECTOR_INVOKE,
    STModification,
    WizardType
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    FormHeaderSection
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import {
    CaptureBindingPattern,
    FunctionDefinition,
    LocalVarDecl,
    NodePosition,
    STKindChecker,
    STNode,
} from "@wso2-enterprise/syntax-tree";

import { DocIcon } from "../../../../../../assets";
import { Context, useDiagramContext } from "../../../../../../Contexts/Diagram";
import { TextPreloaderVertical } from "../../../../../../PreLoader/TextPreloaderVertical";
import {
    createImportStatement,
    createPropertyStatement,
    updatePropertyStatement,
} from "../../../../../utils/modification-util";
import {
    addAccessModifiers,
    getAccessModifiers,
    getActionReturnType,
    getConnectorComponent,
    getFormattedModuleName,
    getInitReturnType,
    getParams,
} from "../../../../Portals/utils";
import { VariableOptions } from "../../../ConfigForms/ModuleVariableForm/util";
import { wizardStyles as useFormStyles } from "../../../ConfigForms/style";
import { ExpressionInjectablesProps, FormGeneratorProps, InjectableItem } from "../../../FormGenerator";
import {
    addDbExtraImport,
    addDbExtraStatements,
    addReturnTypeImports,
    generateDocUrl,
    isDependOnDriver,
    updateFunctionSignatureWithError,
} from "../../../Utils";
import { ConfigWizardState } from "../../index";
import { wizardStyles } from "../../style";
import "../../style.scss";
import { CreateConnectorForm } from "../CreateNewConnection";
import { OperationForm } from "../OperationForm";
import { SelectConnectionForm } from "../SelectExistingConnection";

export interface ConnectorOperation {
    name: string;
    label?: string;
}

enum FormStates {
    ExistingConnection,
    OauthConnect,
    CreateNewConnection,
    OperationDropdown,
    OperationForm,
    SingleForm,
}
interface ConnectorConfigWizardProps {
    connectorInfo: BallerinaConnectorInfo;
    targetPosition: NodePosition;
    configWizardArgs?: ConfigWizardState;
    onClose: () => void;
    onSave: () => void;
    selectedConnector: LocalVarDecl;
    isModuleEndpoint?: boolean;
    isAction?: boolean;
    expressionInjectables?: ExpressionInjectablesProps;
    functionNode?: STNode;
}

export function ConnectorForm(props: FormGeneratorProps) {
    const wizardClasses = wizardStyles();
    const formClasses = useFormStyles();
    const {
        api: {
            code: { modifyDiagram },
            insights: { onEvent }
        },
        props: { stSymbolInfo, isMutationProgress },
    } = useContext(Context);

    const {
        targetPosition,
        configWizardArgs,
        onClose,
        onSave,
        selectedConnector,
        isModuleEndpoint,
        isAction,
        expressionInjectables,
        connectorInfo,
        functionNode
    } = props.configOverlayFormStatus.formArgs as ConnectorConfigWizardProps;

    const {
        props: { syntaxTree, environment },
    } = useDiagramContext();
    const {
        connector,
        functionDefInfo,
        connectorConfig,
        wizardType,
        model,
        isLoading: isConnectorLoading,
    } = configWizardArgs;
    const isOauthConnector = false;
    const connectorName = connector?.displayAnnotation?.label || `${connector?.package.name} / ${connector?.name}` || connectorInfo?.displayAnnotation?.label;
    const connectorModule = connector?.moduleName;
    const config = connectorConfig ? connectorConfig : new ConnectorConfig();
    const selectedOperation = config?.action?.name;
    const isNewConnectorInitWizard = wizardType === WizardType.NEW;

    const [formState, setFormState] = useState<FormStates>(FormStates.CreateNewConnection);
    const [isNewConnection, setIsNewConnection] = useState(isNewConnectorInitWizard);
    const [isLoading, setIsLoading] = useState(true);
    const [responseStatus, setResponseStatus] = useState<number>();

    useEffect(() => {
        if (isAction) {
            setFormState(FormStates.OperationForm);
        } else {
            setFormState(FormStates.CreateNewConnection);
        }
        setIsLoading(false);
    }, []);

    const connectorInitFormFields: FormField[] = functionDefInfo?.get("init")?.parameters || [];

    // managing name set by the non oauth connectors
    config.name =
        connector && isNewConnectorInitWizard && !isAction && !config.name
            ? genVariableName(getFormattedModuleName(connectorModule) + "Endpoint", getAllVariables(stSymbolInfo))
            : config.name;
    const [configName, setConfigName] = useState(config.name);
    const handleConfigNameChange = (name: string) => {
        setConfigName(name);
    };

    if (!config.action) {
        config.action = new ActionConfig();
    }

    if (isModuleEndpoint && model) {
        config.qualifiers = getAccessModifiers(model);
    }

    const actionReturnType = getActionReturnType(selectedOperation, functionDefInfo);
    if (
        !isNewConnectorInitWizard &&
        actionReturnType?.hasReturn &&
        STKindChecker.isLocalVarDecl(model) &&
        STKindChecker.isCaptureBindingPattern(model.typedBindingPattern?.bindingPattern)
    ) {
        config.action.returnVariableName = (
            (model as LocalVarDecl).typedBindingPattern.bindingPattern as CaptureBindingPattern
        ).variableName.value;
    }
    if (model && STKindChecker.isLocalVarDecl(model) && !isNewConnectorInitWizard) {
        config.action.returnType = ((model as LocalVarDecl).typedBindingPattern
            .typeDescriptor.source.trim());
    }

    const onCreateNew = () => {
        setConfigName(genVariableName(connectorModule + "Endpoint", getAllVariables(stSymbolInfo)));
        setConfigName(genVariableName(connectorModule + "Endpoint", getAllVariables(stSymbolInfo)));
        setFormState(FormStates.CreateNewConnection);
        setIsNewConnection(true);
    };

    const onCreateConnectorSave = () => {
        if (isNewConnection) {
            setFormState(FormStates.OperationDropdown);
        } else {
            setFormState(FormStates.OperationForm);
        }
    };

    const onSelectExisting = (value: any) => {
        setConfigName(value);
        setIsNewConnection(false);
        setFormState(FormStates.OperationForm);
    };

    const handleEndpointSave = () => {
        const modifications: STModification[] = [];
        expressionInjectables?.list?.forEach((item: InjectableItem) => {
            modifications.push(item.modification);
        });
        const isInitReturnError = getInitReturnType(functionDefInfo);
        if (!isModuleEndpoint && isInitReturnError && functionNode && STKindChecker.isFunctionDefinition(functionNode)) {
            updateFunctionSignatureWithError(modifications, functionNode as FunctionDefinition);
        }

        const moduleName = getFormattedModuleName(connectorModule);
        let endpointStatement = `${moduleName}:${connector.name} ${config.name} = ${isInitReturnError ? "check" : ""
            } new (${getParams(config.connectorInit).join()});`;

        endpointStatement = addAccessModifiers(config.qualifiers, endpointStatement);

        if (isNewConnectorInitWizard && targetPosition) {
            const addImport: STModification = createImportStatement(
                connector.package.organization,
                connectorModule,
                targetPosition
            );
            addDbExtraImport(modifications, syntaxTree, connector.package.organization, connectorModule);
            modifications.push(addImport);
            const addConnectorInit = createPropertyStatement(endpointStatement, targetPosition);
            modifications.push(addConnectorInit);
            onConnectorAddEvent();
            if (isDependOnDriver(moduleName) && !isModuleEndpoint) {
                const closeStatement = `check ${config.name}.close();`;
                const addCloseStatement = createPropertyStatement(closeStatement, targetPosition);
                modifications.push(addCloseStatement);
            }
        } else {
            const updateConnectorInit = updatePropertyStatement(endpointStatement, connectorConfig.initPosition);
            modifications.push(updateConnectorInit);
        }

        if (modifications.length > 0) {
            modifyDiagram(modifications);
            onSave();
        }
    };

    const handleActionSave = () => {
        const modifications: STModification[] = [];
        const isInitReturnError = getInitReturnType(functionDefInfo);
        const currentActionReturnType = getActionReturnType(config.action.name, functionDefInfo);
        if (isDependOnDriver(connectorModule) && config.action.returnType) {
            currentActionReturnType.returnType = config.action.returnType;
        }
        const moduleName = getFormattedModuleName(connectorModule);

        expressionInjectables?.list?.forEach((item: InjectableItem) => {
            modifications.push(item.modification);
        });

        if (
            (isInitReturnError || currentActionReturnType.hasError) &&
            functionNode &&
            STKindChecker.isFunctionDefinition(functionNode)
        ) {
            updateFunctionSignatureWithError(modifications, functionNode as FunctionDefinition);
        }

        if (isNewConnectorInitWizard && !isAction) {
            const addImport: STModification = createImportStatement(
                connector.package.organization,
                connectorModule,
                targetPosition
            );
            modifications.push(addImport);
            addDbExtraImport(modifications, syntaxTree, connector.package.organization, connectorModule);
            const endpointStatement = `${moduleName}:${connector.name} ${config.name} = ${isInitReturnError ? "check" : ""
                } new (${getParams(config.connectorInit).join()});`;
            const addConnectorInit = createPropertyStatement(endpointStatement, targetPosition);
            modifications.push(addConnectorInit);
        }
        let actionStatement = "";
        if (currentActionReturnType.hasReturn) {
            addReturnTypeImports(modifications, currentActionReturnType);
            actionStatement += `${currentActionReturnType.returnType} ${config.action.returnVariableName} = `;
        }
        actionStatement += `${currentActionReturnType.hasError ? "check" : ""} ${config.name}${config.action.isRemote ? "->" : "."
            }${config.action.name}(${getParams(config.action.fields).join()});`;

        if (!isNewConnectorInitWizard && isAction) {
            const updateActionInvocation = updatePropertyStatement(actionStatement, model.position);
            modifications.push(updateActionInvocation);
        } else {
            const addActionInvocation = createPropertyStatement(actionStatement, targetPosition);
            modifications.push(addActionInvocation);
            onActionAddEvent();
        }

        if (isNewConnectorInitWizard && isDependOnDriver(connectorModule)) {
            addDbExtraStatements(modifications, config, stSymbolInfo, targetPosition, isAction);
        }
        if (modifications.length > 0) {
            modifyDiagram(modifications);
            onSave();
        }
    };

    const handleExtensionSave = (modifications: STModification[]) => {
        if (modifications.length > 0) {
            modifyDiagram(modifications);
            onSave();
        }
    };

    const onConnectionNameChange = () => {
        if (isNewConnection) {
            setFormState(FormStates.CreateNewConnection);
        } else {
            setFormState(FormStates.ExistingConnection);
        }
    };

    const onCreateConnectorBack = () => {
        if (isOauthConnector) {
            setIsNewConnection(true);
            setFormState(FormStates.OauthConnect);
        }
    };

    // TODO: Created common function to send Azure analytics.
    const onActionAddEvent = () => {
        const event: LowcodeEvent = {
            type: SAVE_CONNECTOR,
            property: {
                connectorName
            }
        };
        onEvent(event);
    };
    const onConnectorAddEvent = () => {
        const event: LowcodeEvent = {
            type: SAVE_CONNECTOR_INIT,
            property: {
                connectorName
            }
        };
        onEvent(event);
    };
    const handleCreateConnectorSaveNext = () => {
        setFormState(FormStates.OperationForm);
        const event: LowcodeEvent = {
            type: SAVE_CONNECTOR_INVOKE,
            property: {
                connectorName
            }
        };
        onEvent(event);
    };

    // TODO: fix AI suggestion issue with vscode implementation
    // useEffect(() => {
    //     if (connector) {
    //         let allFormFields: FormField[] = [];
    //         Array.from(functionDefInfo.keys()).forEach((key: string) => {
    //             allFormFields = allFormFields.concat(
    //                 functionDefInfo.get(key).parameters
    //             );
    //         });
    //     }
    //     getAiSuggestions(aiSuggestionsReq).then((res: AiSuggestionsRes) => {
    //       res.suggestedMappings.forEach((schema: string) => {
    //         const varMap = JSON.parse(schema);
    //         const varKeys = Object.keys(varMap);
    //         varKeys.forEach((variable: string) => {
    //           addAiSuggestion(variable, varMap[variable], allFormFields);
    //         });
    //       });
    //     });
    // }, [functionDefInfo]);

    let connectorComponent: ReactNode = (
        <div className={wizardClasses.fullWidth}>
            <div className={wizardClasses.topTitleWrapper}>
                <div className={wizardClasses.titleWrapper}>
                    <div className={wizardClasses.connectorIconWrapper}>
                        <ModuleIcon module={connector} scale={0.5} />
                    </div>
                    <Typography className={wizardClasses.configTitle} variant="h4">
                        {connectorName}
                    </Typography>
                </div>
                <Divider variant="fullWidth" />
            </div>

            {formState === FormStates.OperationForm && (
                <OperationForm
                    functionDefInfo={functionDefInfo}
                    connectionDetails={config}
                    showConnectionName={!isNewConnection}
                    selectedOperation={selectedOperation}
                    onSave={handleActionSave}
                    onConnectionChange={onConnectionNameChange}
                    mutationInProgress={isMutationProgress}
                    isNewConnectorInitWizard={isNewConnectorInitWizard}
                    expressionInjectables={expressionInjectables}
                    targetPosition={targetPosition}
                    connectorInfo={connectorInfo}
                />
            )}
            {formState === FormStates.ExistingConnection && isNewConnectorInitWizard && (
                <SelectConnectionForm
                    onCreateNew={onCreateNew}
                    connectorConfig={config}
                    connector={connector}
                    onSelectExisting={onSelectExisting}
                />
            )}
            {formState === FormStates.CreateNewConnection && (
                <CreateConnectorForm
                    initFields={connectorInitFormFields}
                    onSave={handleEndpointSave}
                    onSaveNext={handleCreateConnectorSaveNext}
                    connectorConfig={config}
                    onConfigNameChange={handleConfigNameChange}
                    onBackClick={onCreateConnectorBack}
                    connector={connector}
                    isNewConnectorInitWizard={isNewConnectorInitWizard}
                    isOauthConnector={isOauthConnector}
                    responseStatus={responseStatus}
                    expressionInjectables={expressionInjectables}
                    targetPosition={targetPosition}
                    isModuleEndpoint={isModuleEndpoint}
                />
            )}
            {formState === FormStates.ExistingConnection && !isNewConnectorInitWizard && (
                <CreateConnectorForm
                    initFields={connectorInitFormFields}
                    onSave={onCreateConnectorSave}
                    connectorConfig={config}
                    onConfigNameChange={handleConfigNameChange}
                    onBackClick={onCreateConnectorBack}
                    connector={connector}
                    isNewConnectorInitWizard={isNewConnectorInitWizard}
                    isOauthConnector={isOauthConnector}
                    responseStatus={responseStatus}
                    expressionInjectables={expressionInjectables}
                    targetPosition={targetPosition}
                    isModuleEndpoint={isModuleEndpoint}
                />
            )}
        </div>
    );

    if (functionDefInfo && connector.moduleName === "http" && connector.name === "Client") {
        connectorComponent = getConnectorComponent(connectorModule + connector.name, {
            functionDefinitions: functionDefInfo,
            connectorConfig: config,
            onSave: handleExtensionSave,
            onClose,
            connector,
            isNewConnectorInitWizard,
            targetPosition,
            model,
            selectedConnector,
            isModuleEndpoint,
            isAction,
        });
    }

    return (
        <FormControl data-testid="connector-form" className={formClasses.wizardFormControl}>
            <FormHeaderSection
                onCancel={onClose}
                formTitle={"lowcode.develop.configForms.connector.title"}
                defaultMessage={"Connector"}
            />
            <div className={formClasses.formWrapper}>
                <div className={formClasses.formFeilds}>
                    {(isLoading || isConnectorLoading) && (
                        <div className={wizardClasses.loaderWrapper}>
                            <TextPreloaderVertical position="relative" />
                        </div>
                    )}
                    {!(isLoading || isConnectorLoading) && functionDefInfo && (
                        <div className={wizardClasses.mainApiWrapper}>{connectorComponent}</div>
                    )}
                </div>
            </div>
        </FormControl>
    );
}
