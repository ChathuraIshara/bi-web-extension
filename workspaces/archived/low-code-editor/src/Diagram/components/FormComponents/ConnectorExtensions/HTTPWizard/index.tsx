/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useState } from "react";
import { FormattedMessage } from "react-intl";

import { IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { CloseRounded } from "@material-ui/icons";
import { ActionConfig, Connector, ConnectorConfig, CONNECTOR_CLOSED, FormField, FunctionDefinitionInfo, LowcodeEvent, ResponsePayloadMap, SAVE_CONNECTOR, SAVE_CONNECTOR_INIT, SAVE_CONNECTOR_INVOKE, STModification } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { ButtonWithIcon } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { CaptureBindingPattern, FunctionDefinition, LocalVarDecl, NodePosition, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";

import { DocIcon } from "../../../../../assets";
import { Context } from "../../../../../Contexts/Diagram";
import {
    createImportStatement,
    createPropertyStatement,
    updateFunctionSignature,
    updatePropertyStatement
} from "../../../../utils/modification-util";
import { getModuleIcon, getParams } from "../../../Portals/utils";
import { wizardStyles } from "../../ConnectorConfigWizard/style";
import { generateDocUrl } from "../../Utils";

import { CreateConnectorForm } from "./CreateConnectorForm";
import { SelectInputOutputForm } from "./SelectInputOutputForm";
import "./style.scss"
import { useStyles } from "./styles";
interface WizardProps {
    functionDefinitions: Map<string, FunctionDefinitionInfo>;
    connectorConfig: ConnectorConfig;
    onSave: (sourceModifications: STModification[]) => void;
    onClose?: () => void;
    connector: Connector;
    isNewConnectorInitWizard: boolean;
    targetPosition: NodePosition;
    model?: STNode,
    selectedConnector?: LocalVarDecl;
    isModuleEndpoint?: boolean;
    isAction?: boolean;
    functionNode?: STNode;
}

enum InitFormState {
    Home = -1,
    Create,
    OperationDropdown,
    SelectInputOutput
}

export function HTTPWizard(props: WizardProps) {
    const classes = useStyles();
    const wizardClasses = wizardStyles();
    const { functionDefinitions, connectorConfig, connector, onSave, onClose, isNewConnectorInitWizard, targetPosition,
            model, selectedConnector, isModuleEndpoint, isAction, functionNode } = props;
    const {
        api: {
            insights: {
                onEvent
            },
        },
        props: {
            stSymbolInfo,
            environment
        }
    } = useContext(Context);

    const connectorInitFormFields: FormField[] = functionDefinitions.get("init")?.parameters;
    const enableConnectorInitalizePage = !isAction;

    const initFormState = enableConnectorInitalizePage ? InitFormState.Create : InitFormState.SelectInputOutput;

    connectorConfig.connectorInit = connectorConfig.connectorInit.length > 0 ? connectorConfig.connectorInit
        : connectorInitFormFields;
    const [state, setState] = useState<InitFormState>(initFormState);

    const operations: string[] = [];
    if (functionDefinitions) {
        functionDefinitions.forEach((value, key) => {
            if (key !== "init") {
                operations.push(key);
            }
        });
    }

    const payloadTypes: Map<string, string> = new Map();
    const responsePayloadMap: ResponsePayloadMap = {
        isPayloadSelected: false,
        payloadTypes,
    };
    connectorConfig.responsePayloadMap = responsePayloadMap;

    if (!connectorConfig.action) {
        connectorConfig.action = new ActionConfig();
    }

    React.useEffect(() => {
        if (!isNewConnectorInitWizard && isAction) {
            setState(InitFormState.SelectInputOutput);
        } else if (selectedConnector) {
            connectorConfig.isExistingConnection = true;
            setState(InitFormState.SelectInputOutput);
        }
        const targetTypeValue = connectorConfig?.action?.fields?.find(field => field.name === "targetType")?.value;
        if (targetTypeValue) {
            connectorConfig.responsePayloadMap.isPayloadSelected = true;
            if (targetTypeValue === "json") {
                connectorConfig.responsePayloadMap.selectedPayloadType = "JSON";
            } else if (targetTypeValue === "xml") {
                connectorConfig.responsePayloadMap.selectedPayloadType = "XML";
            } else if (targetTypeValue === "string") {
                connectorConfig.responsePayloadMap.selectedPayloadType = "String";
            } else {
                connectorConfig.responsePayloadMap.selectedPayloadType = "http:Response";
            }
        }
    }, [isNewConnectorInitWizard, selectedConnector])

    const handleCreateConnectorOnSaveNext = () => {
        setState(InitFormState.SelectInputOutput);
        const event: LowcodeEvent = {
            type: SAVE_CONNECTOR_INVOKE,
            property: {
                connectorName: connector?.displayName || connector?.moduleName
            }
        };
        onEvent(event);
    };

    const handleConnectionChange = () => {
        setState(InitFormState.Create);
    };

    const handleFormClose = () => {
        const event: LowcodeEvent = {
            type: CONNECTOR_CLOSED,
            property: {
                connectorName: connector?.displayName || connector?.moduleName
            }
        };
        onEvent(event);
        onClose();
    };

    const updateFunctionSignatureWithError = () => {
        if (!(functionNode && STKindChecker.isFunctionDefinition(functionNode))) {
            return undefined;
        }
        const activeFunction = functionNode as FunctionDefinition;
        const parametersStr = activeFunction.functionSignature.parameters.map((item) => item.source).join(",");
        let returnTypeStr = activeFunction.functionSignature.returnTypeDesc?.source.trim();

        if (returnTypeStr?.includes("error")) {
            return undefined;
        }

        if (returnTypeStr?.includes("?") || returnTypeStr?.includes("()")) {
            returnTypeStr = returnTypeStr + "|error";
        } else if (returnTypeStr) {
            returnTypeStr = returnTypeStr + "|error?";
        } else {
            returnTypeStr = "returns error?";
        }

        return updateFunctionSignature(activeFunction.functionName.value, parametersStr, returnTypeStr, {
            ...activeFunction.functionSignature.position,
            startColumn: activeFunction.functionName.position.startColumn,
        });
    };

    const handleCreateConnectorOnSave = () => {
        const event: LowcodeEvent = {
            type: SAVE_CONNECTOR_INIT,
            property: {
                connectorName: connector?.displayName || connector?.moduleName
            }
        };
        onEvent(event);
        const modifications: STModification[] = [];
        const functionSignature = updateFunctionSignatureWithError();
        if (functionSignature) {
            modifications.push(functionSignature);
        }
        if (!isNewConnectorInitWizard) {
            const updatedConnectorInit = updatePropertyStatement(
                `${connector.moduleName}:${connector.name} ${connectorConfig.name} = check new (${getParams(
                    connectorConfig.connectorInit).join()});`, connectorConfig.initPosition);
            modifications.push(updatedConnectorInit);
        } else {
            // Add an import.
            const addImport: STModification = createImportStatement(
                connector.package.organization,
                connector.moduleName,
                targetPosition
            );
            modifications.push(addImport);

            // Add an connector client initialization.
            if (!connectorConfig.isExistingConnection) {
                const addConnectorInit = createPropertyStatement(
                    `${connector.moduleName}:${connector.name} ${connectorConfig.name} = check new (${getParams(connectorConfig.connectorInit).join()});`,
                    targetPosition
                );
                modifications.push(addConnectorInit);
            }
        }
        onSave(modifications);
    };

    const handleActionOnSave = () => {
        const modifications: STModification[] = [];
        const selectedPayloadType = connectorConfig.action.fields.find(
            (field) => field.name === "targetType"
        ).selectedDataType;
        const functionSignature = updateFunctionSignatureWithError();
        if (functionSignature) {
            modifications.push(functionSignature);
        }
        if (isNewConnectorInitWizard && !isAction) {
            const addImport: STModification = createImportStatement(
                connector.package.organization,
                connector.moduleName,
                targetPosition
            );
            modifications.push(addImport);
            const endpointStatement = `${connector.moduleName}:${connector.name} ${connectorConfig.name
                } = check new (${getParams(connectorConfig.connectorInit).join()});`;
            const addConnectorInit = createPropertyStatement(endpointStatement, targetPosition);
            modifications.push(addConnectorInit);
        }

        const actionStatement = `${selectedPayloadType} ${connectorConfig.action.returnVariableName} = check ${connectorConfig.name
            }->${connectorConfig.action.name}(${getParams(connectorConfig.action.fields).join()});`;

        if (!isNewConnectorInitWizard && isAction) {
            const updateActionInvocation = updatePropertyStatement(actionStatement, model.position);
            modifications.push(updateActionInvocation);
        } else {
            const addActionInvocation = createPropertyStatement(actionStatement, targetPosition);
            modifications.push(addActionInvocation);
            onActionAddEvent();
        }

        onSave(modifications);
    };

    const onActionAddEvent = () => {
        const event: LowcodeEvent = {
            type: SAVE_CONNECTOR,
            connectorName: connector?.displayName || connector?.moduleName
        };
        onEvent(event);
    };

    return (
        <div className={classes.root}>
            <div className={wizardClasses.topTitleWrapper}>
                <ButtonWithIcon
                    className={wizardClasses.closeBtnAutoGen}
                    onClick={handleFormClose}
                    icon={<CloseRounded fontSize="small" />}
                />
                <div className={wizardClasses.titleWrapper}>
                    <div className={wizardClasses.connectorIconWrapper}>{getModuleIcon(connector, 0.5)}</div>
                    <Typography className={wizardClasses.configTitle} variant="h4">{isNewConnectorInitWizard ? "New" : "Update"} {connector.displayName} <FormattedMessage id="lowcode.develop.connectorForms.HTTP.connection.title" defaultMessage="Connection" /></Typography>
                </div>
            </div>
            <>
                {state === InitFormState.Create && (
                    <CreateConnectorForm
                        homePageEnabled={enableConnectorInitalizePage}
                        functionDefinitions={functionDefinitions}
                        onSaveNext={handleCreateConnectorOnSaveNext}
                        onSave={handleCreateConnectorOnSave}
                        connectorConfig={connectorConfig}
                        // onBackClick={handleBack}
                        connector={connector}
                        isNewConnectorInitWizard={isNewConnectorInitWizard}
                        targetPosition={targetPosition}
                        isModuleEndpoint={isModuleEndpoint}
                    />
                )}
                {state === InitFormState.SelectInputOutput && (
                    <SelectInputOutputForm
                        functionDefinitions={functionDefinitions}
                        onSave={handleActionOnSave}
                        onConnectionChange={handleConnectionChange}
                        connectorConfig={connectorConfig}
                        isNewConnectorInitWizard={isNewConnectorInitWizard}
                        targetPosition={targetPosition}
                        model={model}
                    />
                )}
            </>
        </div>
    );
}

export function getVariableWithName(varName: string, variables: Map<string, STNode[]>): STNode {
    let variableST;

    variables.forEach((value) => {
        value.forEach(val => {
            if (varName === (((val as LocalVarDecl).typedBindingPattern.bindingPattern) as CaptureBindingPattern).variableName.value) {
                variableST = val;
            }
        })
    })

    return variableST;
}
