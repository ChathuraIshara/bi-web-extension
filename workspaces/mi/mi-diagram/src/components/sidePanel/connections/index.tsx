/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Codicon, LinkButton, Tooltip, Typography } from "@wso2-enterprise/ui-toolkit";
import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import SidePanelContext from "../SidePanelContexProvider";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { sidepanelAddPage } from "..";
import { FirstCharToUpperCase } from "../../../utils/commons";
import { MACHINE_VIEW, POPUP_EVENT_TYPE, ParentPopupData } from "@wso2-enterprise/mi-core";
import path from "path";
import { MediatorPage } from "../mediators/Mediator";
import { DEFAULT_ICON } from "../../../resources/constants";
import { ButtonGroup, GridButton } from "../commons/ButtonGroup";
import { DiagramService } from "@wso2-enterprise/mi-syntax-tree/lib/src";

const MessageWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 0;
`;

const OldProjectMessage = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
    gap: 10px;
`;

const ConnectionWrapper = styled.div`
    padding: 0px;
    display: flex;
    flex-direction: column;
`;

const SectionTitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 20px;
`;

const SectionContainer = styled.div`
    width: 390px;
`;

const ExternalsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

interface Connection {
    name: string;
    connectionType: string;
    path: string;
    connectionIconPath?: string;
}

interface ConnectionsData {
    [key: string]: { connections: Connection[], connectorData: any };
}

export interface ConnectorPageProps {
    documentUri: string;
    searchValue?: string;
    clearSearch?: () => void;
    nodePosition: any;
    trailingSpace: string;
    artifactModel: DiagramService;
}

export function ConnectionPage(props: ConnectorPageProps) {
    const sidePanelContext = useContext(SidePanelContext);
    const { rpcClient } = useVisualizerContext();
    const [expandedConnections, setExpandedConnections] = useState<any[]>([]);
    const [connections, setConnections] = useState<ConnectionsData>(undefined);
    const [filteredConnections, setFilteredConnections] = useState<ConnectionsData>(undefined);
    const [filteredOperations, setFilteredOperations] = useState<any[][]>([]);
    const [isOldProject, setIsOldProject] = useState(false);
    const [debouncedValue, setDebouncedValue] = useState(props.searchValue);

    const fetchConnections = async () => {
        const connectionData: any = await rpcClient.getMiDiagramRpcClient().getConnectorConnections({
            documentUri: props.documentUri,
            connectorName: null
        });

        const connectorData = await rpcClient.getMiDiagramRpcClient().getAvailableConnectors({
            documentUri: props.documentUri,
            connectorName: ""
        });

        if (connectionData) {

            const newConnectionInfo: ConnectionsData = Object.fromEntries(await Promise.all(
                Object.keys(connectionData).map(async (key) => {
                    const connector = connectorData.connectors.find((connector: any) => connector.name === key);

                    const iconPath = await rpcClient.getMiDiagramRpcClient().getIconPathUri({ path: connector.iconPath, name: "icon-small" });

                    const connections = await Promise.all(connectionData[key].connections.map(async (connection: Connection) => {
                        const connectionIconPath = connection.connectionType && await rpcClient.getMiDiagramRpcClient().getIconPathUri({
                            path: path.join(connector.iconPath, 'connections'),
                            name: connection.connectionType
                        });
                        return {
                            ...connection,
                            connectionIconPath: connectionIconPath.uri ?? iconPath.uri
                        };
                    }));
                    return [key, { connections, connectorData: connector }];
                })
            ));

            setConnections(newConnectionInfo);
            return (newConnectionInfo);
        }
    };

    useEffect(() => {
        checkOldProject();
        fetchConnections();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(props.searchValue);
            if (!props.searchValue) {
                setExpandedConnections([]);
            }
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [props.searchValue]);

    const checkOldProject = async () => {
        const oldProjectResponse = await rpcClient.getMiDiagramRpcClient().checkOldProject();
        setIsOldProject(oldProjectResponse);
    };

    const searchConnections = () => {
        if (connections) {
            const searchResults: ConnectionsData = {};

            Object.keys(connections).forEach((key) => {
                const matchingConnections = connections[key].connections?.filter((connection) => {
                    // Connection Name match
                    const nameMatch = connection.name.toLowerCase().includes(debouncedValue.toLowerCase());

                    // Operation matches
                    const operations = connections[key].connectorData?.actions || [];
                    const operationMatch = operations.some((operation: any) => {
                        const operationNameMatch = operation.name.toLowerCase().includes(debouncedValue.toLowerCase());
                        if (operationNameMatch) {
                            const allowedTypes = operation.allowedConnectionTypes;
                            return allowedTypes?.includes(connection.connectionType);
                        }
                        return false;
                    });

                    (nameMatch || operationMatch) && setExpandedConnections(prev => [...prev, connection]);
                    return nameMatch || operationMatch;
                });

                if (matchingConnections.length > 0) {
                    if (!searchResults[key]) {
                        searchResults[key] = {
                            ...connections[key],
                            connections: []
                        };
                    }
                    searchResults[key].connections.push(...matchingConnections);
                }
            });

            return searchResults;
        }
    }

    const searchOperations = () => {
        if (connections) {
            const searchResults: any[][] = [];

            Object.keys(connections).forEach((key) => {
                connections[key].connections?.forEach((connection) => {
                    const nameMatch = connection.name.toLowerCase().includes(debouncedValue.toLowerCase());

                    if (!nameMatch) {
                        const matchingActions: any[] = [];
                        const operations = connections[key].connectorData?.actions || [];
                        operations.forEach((operation: any) => {
                            const operationNameMatch = operation.name.toLowerCase().includes(debouncedValue.toLowerCase());
                            if (operationNameMatch) {
                                matchingActions.push(operation);
                            }
                        });

                        if (matchingActions.length > 0) {
                            searchResults.push([connection, matchingActions]);
                        }
                    }
                });
            });

            return searchResults;
        }
    }

    useEffect(() => {
        let connectionsFiltered = connections;
        let operationsFiltered = [];

        if (debouncedValue) {
            connectionsFiltered = searchConnections();
            operationsFiltered = searchOperations();
            setFilteredOperations(operationsFiltered);
        } else {
            setFilteredOperations([]);
        }

        setFilteredConnections(connectionsFiltered);
    }, [debouncedValue, connections]);

    const addNewConnection = async () => {
        rpcClient.getMiVisualizerRpcClient().openView({
            type: POPUP_EVENT_TYPE.OPEN_VIEW,
            location: {
                documentUri: props.documentUri,
                view: MACHINE_VIEW.ConnectorStore
            },
            isPopup: true
        });

        rpcClient.onParentPopupSubmitted(async (data: ParentPopupData) => {
            if (data.recentIdentifier) {
                const newConnections = await fetchConnections();
                const newConnection = getConnectionByName(data.recentIdentifier, newConnections);
                setExpandedConnections([newConnection]);
            }
        });
    }

    function getConnectionByName(connectionName: string, connections: ConnectionsData): Connection | undefined {
        for (const key in connections) {
            const foundConnection = (connections[key].connections).find(connection => connection.name === connectionName);
            if (foundConnection) {
                return foundConnection;
            }
        }
        return undefined;
    }

    const generateForm = async (connection: Connection, operation: string, connectorData: any) => {

        const uiSchemaPath = connectorData?.uiSchemaPath;

        // Retrieve form
        const formJSON = await rpcClient.getMiDiagramRpcClient().getConnectorForm({ uiSchemaPath: uiSchemaPath, operation: operation });
        const parameters = connectorData.actions.find((action: any) => action.name === operation)?.parameters || null;
        const iconPath = await rpcClient.getMiDiagramRpcClient().getIconPathUri({ path: connectorData.iconPath, name: "icon-small" });

        const icon = <img src={iconPath.uri}
            alt="Icon"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_ICON
            }} />;

        const page = <div style={{ padding: '20px' }}>
            <MediatorPage
                connectorData={{
                    form: (formJSON as any).formJSON,
                    connectorName: connectorData.name,
                    connectionName: connection.name,
                    operationName: operation,
                    connectionType: connection.connectionType,
                    parameters: parameters,
                }}
                mediatorType={sidePanelContext.tag}
                isUpdate={false}
                documentUri={props.documentUri}
                nodeRange={props.nodePosition}
                showForm={true}
                artifactModel={props.artifactModel}
            />
        </div>;
        sidepanelAddPage(sidePanelContext, page, `${sidePanelContext.isEditing ? "Edit" : "Add"} ${operation}`, icon);
    }

    const ConnectionList = () => {

        return (
            <>

                {isOldProject ? (
                    <OldProjectMessage>
                        <Codicon name="warning" />
                        Connector store is not supported with the old project structure.
                        Please migrate to use the connector store and other features.
                    </OldProjectMessage>
                ) : connections && (
                    <SectionContainer>
                        <SectionTitleWrapper>
                            <Typography variant="h3" sx={{ margin: '0px' }}>Available Connections</Typography>
                            {Object.values(connections).some(({ connections }) => connections.length > 0) && (
                                <LinkButton onClick={() => addNewConnection()}>
                                    <Codicon name="plus" />Add new connection
                                </LinkButton>
                            )}
                        </SectionTitleWrapper>
                        {Object.values(connections).every(({ connections }) => connections.length === 0) ? (
                            <>
                                <MessageWrapper>
                                    No connections available. Please create a new connection.
                                </MessageWrapper>
                                <LinkButton onClick={() => addNewConnection()}>
                                    <Codicon name="plus" />Add new connection
                                </LinkButton>
                            </>
                        ) : filteredConnections && (
                            Object.keys(filteredConnections).length === 0 ?
                                <h3 style={{ textAlign: "center" }}>No connections found</h3> : (
                                    <ConnectionWrapper>
                                        {Object.keys(filteredConnections).map((key) => {
                                            return (
                                                <div key={key}>
                                                    {filteredConnections[key].connections.map((connection, index) => (
                                                        connection && (
                                                            <div key={key} data-key={key}>
                                                                <ButtonGroup
                                                                    key={key}
                                                                    title={connection.name}
                                                                    isCollapsed={!expandedConnections.includes(connection)}
                                                                    iconUri={connection.connectionIconPath}>
                                                                    <>
                                                                        {((filteredOperations.find(([filteredConnection]) => filteredConnection === connection)?.slice(1)[0])
                                                                            || filteredConnections[key].connectorData?.actions).map((operation: any) => {
                                                                                const allowedTypes = operation.allowedConnectionTypes;
                                                                                if (operation.isHidden || (!(allowedTypes?.some((type: string) => type.toLowerCase() === connection.connectionType.toLowerCase())))) {
                                                                                    return null;
                                                                                }

                                                                                return (
                                                                                    <Tooltip content={operation?.tooltip} position='bottom' key={operation.name}>
                                                                                        <GridButton
                                                                                            key={operation.name}
                                                                                            title={FirstCharToUpperCase(operation.name)}
                                                                                            description={operation.description}
                                                                                            icon={
                                                                                                <img
                                                                                                    src={connection.connectionIconPath}
                                                                                                    alt="Icon"
                                                                                                    onError={(e) => {
                                                                                                        const target = e.target as HTMLImageElement;
                                                                                                        target.src = DEFAULT_ICON;
                                                                                                    }}
                                                                                                />
                                                                                            }
                                                                                            onClick={() => generateForm(
                                                                                                connection,
                                                                                                operation.name,
                                                                                                filteredConnections[key].connectorData
                                                                                            )}
                                                                                        />
                                                                                    </Tooltip>
                                                                                );
                                                                            })}
                                                                    </>
                                                                </ButtonGroup >
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </ConnectionWrapper>
                                )
                        )}
                    </SectionContainer>
                )}
            </>
        )
    }

    return (
        <ExternalsContainer>
            <ConnectionList />
        </ExternalsContainer>
    );
}
