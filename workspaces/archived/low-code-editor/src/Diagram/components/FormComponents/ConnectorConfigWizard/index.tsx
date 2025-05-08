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
import { useIntl } from "react-intl";

import { DefaultConfig } from "@wso2-enterprise/ballerina-low-code-diagram";
import {
    BallerinaConnectorInfo,
    BallerinaConstruct,
    Connector,
    ConnectorConfig,
    CONNECTOR_CLOSED,
    DiagramOverlayPosition,
    FunctionDefinitionInfo,
    LowcodeEvent,
    WizardType
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { LocalVarDecl, NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../Contexts/Diagram";
import { fetchConnectorInfo } from "../../Portals/utils";
import { fetchConnectorsList } from "../ConfigForms/ConnectorWizard/ConnectorList";
import { SearchQueryParams } from "../ConfigForms/Marketplace";
import { FormGenerator } from "../FormGenerator";

export interface ConfigWizardState {
    isLoading: boolean;
    connector: BallerinaConnectorInfo;
    functionDefInfo: Map<string, FunctionDefinitionInfo>;
    connectorConfig: ConnectorConfig;
    model?: STNode;
    wizardType?: WizardType;
}

export function ConnectorConfigWizard(props: any) {
    const {
        actions: {
            toggleDiagramOverlay
        },
        props: {
            isCodeEditorActive,
            userInfo,
            langServerURL,
            stSymbolInfo,
            currentFile
        },
        api: {
            ls: {
                getDiagramEditorLangClient
            },
            panNZoom: {
                pan,
                fitToScreen
            },
            notifications: {
                triggerErrorNotification,
            },
            configPanel: {
                closeConfigOverlayForm: dispatchOverlayClose,
            },
            insights: {
                onEvent
            }
        }
    } = useContext(Context);

    const {
        position,
        connectorInfo,
        endpointName,
        targetPosition,
        model,
        onClose,
        onSave,
        selectedConnector,
        isModuleEndpoint,
        isAction,
        isEdit,
        specialConnectorName,
        functionNode,
        isLoading
    } = props;

    const initWizardState: ConfigWizardState = {
        isLoading: true,
        connectorConfig: undefined,
        functionDefInfo: undefined,
        connector: undefined,
        wizardType: isEdit ? WizardType.EXISTING : WizardType.NEW
    };

    const [wizardState, setWizardState] = useState<ConfigWizardState>(
        initWizardState
    );

    const intl = useIntl();
    const connectionErrorMsgText = intl.formatMessage({
        id: "lowcode.develop.connectorForms.createConnection.errorMessage",
        defaultMessage: "Something went wrong. Couldn't load the connection.",
    });

    React.useEffect(() => {
        fitToScreen();
        pan(0, -position.y + DefaultConfig.dotGap * 3);
    }, []);

    React.useEffect(() => {
        if (wizardState.isLoading && connectorInfo) {
            (async () => {
                let connector = connectorInfo;
                if (specialConnectorName) {
                    const queryParams: SearchQueryParams = {
                        query: specialConnectorName.toLocaleLowerCase(),
                        category: "",
                        filterState: {},
                        limit: 18,
                        page: 1,
                    };
                    const langClient = await getDiagramEditorLangClient();
                    const ballerinaConnectorInfo = await fetchConnectorsList(queryParams, currentFile.path,
                        langClient, userInfo);
                    connector = ballerinaConnectorInfo.central.find((balModule: BallerinaConstruct) =>
                    (balModule.moduleName === specialConnectorName.toLocaleLowerCase() &&
                        balModule.name === "Client")) as BallerinaConnectorInfo;
                }

                const connectorInfoResponse = await fetchConnectorInfo(
                    connector,
                    model,
                    stSymbolInfo,
                    langServerURL,
                    currentFile.path,
                    getDiagramEditorLangClient
                );
                if (connectorInfoResponse) {
                    connectorInfoResponse.wizardType = isEdit ? WizardType.EXISTING : WizardType.NEW;
                    if (endpointName && isAction && !isEdit) {
                        connectorInfoResponse.connectorConfig.name = endpointName;
                    }
                    setWizardState(connectorInfoResponse);
                } else {
                    triggerErrorNotification(new Error(connectionErrorMsgText));
                    handleClose();
                }
            })();
            toggleDiagramOverlay();
        }
    }, [wizardState, connectorInfo]);

    const handleClose = () => {
        onClose();
        dispatchOverlayClose();
        toggleDiagramOverlay();
        const event: LowcodeEvent = {
            type: CONNECTOR_CLOSED,
            property: {
                connectorName: connectorInfo?.displayName
            }
        };
        onEvent(event);
    };

    const handleSave = () => {
        onSave();
    };

    return (
        <div>
            {!isCodeEditorActive ? (
                <FormGenerator
                    onCancel={handleClose}
                    configOverlayFormStatus={{
                        formType: "Connector",
                        formArgs: {
                            selectedConnector,
                            targetPosition,
                            configWizardArgs: wizardState,
                            connectorInfo,
                            isModuleEndpoint,
                            isAction,
                            functionNode,
                            onClose: handleClose,
                            onSave: handleSave,
                        },
                        isLoading: isLoading || wizardState.isLoading,
                    }}
                />
            ) : null}
        </div>
    );
}
