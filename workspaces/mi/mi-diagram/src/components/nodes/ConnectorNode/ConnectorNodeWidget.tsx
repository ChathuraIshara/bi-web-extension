/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { ConnectorNodeModel } from "./ConnectorNodeModel";
import { Colors, NODE_DIMENSIONS } from "../../../resources/constants";
import { STNode, Tool } from "@wso2-enterprise/mi-syntax-tree/src";
import { ClickAwayListener, Icon, Menu, MenuItem, Popover, Tooltip } from "@wso2-enterprise/ui-toolkit";
import { MoreVertIcon } from "../../../resources";
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import SidePanelContext from "../../sidePanel/SidePanelContexProvider";
import { Connector } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { BreakpointMenu } from "../../BreakpointMenu/BreakpointMenu";
import { Body, Content, Description, Header, Name, OptionsMenu } from "../BaseNodeModel";
import { FirstCharToUpperCase } from "../../../utils/commons";
import path from "path";
import { MACHINE_VIEW, POPUP_EVENT_TYPE } from "@wso2-enterprise/mi-core";

namespace S {
    export type NodeStyleProp = {
        selected: boolean;
        hovered: boolean;
        hasError: boolean;
        isActiveBreakpoint?: boolean;
    };
    export const Node = styled.div<NodeStyleProp>`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: ${NODE_DIMENSIONS.CONNECTOR.WIDTH - (NODE_DIMENSIONS.BORDER * 2)}px;
        height: ${NODE_DIMENSIONS.CONNECTOR.HEIGHT - (NODE_DIMENSIONS.BORDER * 2)}px;
        border: ${NODE_DIMENSIONS.BORDER}px solid
            ${(props: NodeStyleProp) =>
            props.hasError ? Colors.ERROR : props.selected ? Colors.SECONDARY : props.hovered ? Colors.SECONDARY : Colors.OUTLINE_VARIANT};
        border-radius: 10px;
        background-color: ${(props: NodeStyleProp) => props?.isActiveBreakpoint ? Colors.DEBUGGER_BREAKPOINT_BACKGROUND : Colors.SURFACE_BRIGHT};
        color: ${Colors.ON_SURFACE};
        cursor: pointer;
    `;

    export const CircleContainer = styled.div`
        position: absolute;
        top: 5px;
        left: ${NODE_DIMENSIONS.CALL.WIDTH}px;
        color: ${Colors.ON_SURFACE};
        cursor: pointer;
        font-family: var(--font-family);
        font-size: var(--type-ramp-base-font-size);
    `;

    export const ConnectionContainer = styled.div`
        position: absolute;
        top: 60px;
        left: 235px;
        transform: translateX(-50%);
        color: ${Colors.ON_SURFACE};
        cursor: pointer;
        font-family: var(--font-family);
        font-size: var(--type-ramp-base-font-size);
    `;

    export const ConnectionText = styled.div`
        max-width: 130px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `;

    export const IconContainer = styled.div`
        padding: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        & img {
            height: 25px;
            width: 25px;
            fill: ${Colors.ON_SURFACE};
            stroke: ${Colors.ON_SURFACE};
        }
    `;

    export const TopPortWidget = styled(PortWidget)`
        margin-top: -3px;
    `;

    export const BottomPortWidget = styled(PortWidget)`
        margin-bottom: -3px;
    `;

    export const NodeText = styled.div`
        max-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `;

    export const TooltipContent = styled.div`
        max-width: 80vw;
        white-space: pre-wrap;
    `;
}
interface ConnectorNodeWidgetProps {
    node: ConnectorNodeModel;
    engine: DiagramEngine;
    onClick?: (node: STNode) => void;
}

export function ConnectorNodeWidget(props: ConnectorNodeWidgetProps) {
    const { node, engine } = props;
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
    const [iconPath, setIconPath] = useState(null);
    const [connectionIconPath, setConnectionIconPath] = useState(null);
    const [isHoveredConnector, setIsHoveredConnector] = React.useState(false);
    const [isConnectorSelected, setIsConnectorSelected] = React.useState(false);
    const sidePanelContext = React.useContext(SidePanelContext);
    const { rpcClient, setIsLoading: setDiagramLoading } = useVisualizerContext();
    const hasDiagnotics = node.hasDiagnotics();
    const hasBreakpoint = node.hasBreakpoint();
    const isActiveBreakpoint = node.isActiveBreakpoint();
    const connectorNode = ((node.stNode as Tool).mediator ?? node.stNode) as Connector;
    const tooltip = hasDiagnotics ? node.getDiagnostics().map(diagnostic => diagnostic.message).join("\n") : undefined;

    useEffect(() => {
        node.setSelected(sidePanelContext?.node === node);
    }, [sidePanelContext?.node]);

    const TooltipEl = useMemo(() => {
        return () => (
            <S.TooltipContent style={{ textWrap: "wrap" }}>
                {tooltip}
            </S.TooltipContent>
        );
    }, [tooltip]);

    useEffect(() => {
        const fetchData = async () => {
            const connectorData = await rpcClient.getMiDiagramRpcClient().getAvailableConnectors({
                documentUri: node.documentUri,
                connectorName: connectorNode.tag.split(".")[0]
            });

            const iconPath = await rpcClient.getMiDiagramRpcClient().getIconPathUri({ path: connectorData.iconPath, name: "icon-small" });
            setIconPath(iconPath.uri);

            const connectionData: any = await rpcClient.getMiDiagramRpcClient().getConnectorConnections({
                documentUri: node.documentUri,
                connectorName: node.stNode.tag.split(".")[0]
            });

            const connectionName = connectorNode.configKey;
            const connection = connectionData.connections.find((connection: any) => connection.name === connectionName);
            const connectionType = connection ? connection.connectionType : null;

            const connectionIconPath = connectionType ? await rpcClient.getMiDiagramRpcClient().getIconPathUri({
                path: path.join(connectorData.iconPath, 'connections'),
                name: connectionType
            }) : iconPath;

            setConnectionIconPath(connectionIconPath.uri ?? iconPath.uri);

        }

        fetchData();
    }, [node]);

    const handleOnClickMenu = (event: any) => {
        setIsPopoverOpen(!isPopoverOpen);
        setPopoverAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handlePopoverClose = () => {
        setIsPopoverOpen(false);
    }

    const getConnectionNodeRange = async () => {
        const text = await rpcClient?.getMiDiagramRpcClient().getTextAtRange({
            documentUri: node.documentUri,
            range: node.stNode.range.startTagRange
        });

        const lastQuoteIndex = text.text.lastIndexOf('"') !== -1 ? text.text.lastIndexOf('"') : text.text.lastIndexOf("'");
        const textBeforeLastQuote = text.text.substring(0, lastQuoteIndex + 1);

        const configKeyLines = textBeforeLastQuote.split('\n');
        const connectionNameLine = configKeyLines?.[configKeyLines.length - 1];

        const firstQuoteIndex = connectionNameLine?.indexOf('"') !== -1 ? connectionNameLine?.indexOf('"') : connectionNameLine?.indexOf("'");

        const newlineCount = configKeyLines.length - 1;

        const connectionNameStartPosition = {
            line: node.stNode.range.startTagRange.start.line + newlineCount,
            character: newlineCount === 0 ? node.stNode.range.startTagRange.start.character + firstQuoteIndex + 1
                : firstQuoteIndex + 1
        }

        const connectionNameEndPosition = {
            line: node.stNode.range.startTagRange.start.line + newlineCount,
            character: newlineCount === 0 ? node.stNode.range.startTagRange.start.character + firstQuoteIndex + connectorNode.configKey.length + 1
                : firstQuoteIndex + connectorNode.configKey.length + 1
        }

        const nodeRange = { start: connectionNameStartPosition, end: connectionNameEndPosition };

        return nodeRange;
    }

    const handleOnClick = async (e: any) => {
        e.stopPropagation();
        const nodeRange = { start: node.stNode.range.startTagRange.start, end: node.stNode?.range?.endTagRange?.end || node.stNode.range.startTagRange.end };
        if (e.ctrlKey || e.metaKey) {
            // open code and highlight the selected node
            rpcClient.getMiDiagramRpcClient().highlightCode({
                range: nodeRange,
                force: true,
            });
        } else if (node.isSelected()) {
            const connectorData = await rpcClient.getMiDiagramRpcClient().getAvailableConnectors({
                documentUri: node.documentUri,
                connectorName: connectorNode.tag.split(".")[0]
            });

            const operationName = connectorNode.tag.split(/\.(.+)/)[1];
            const connectorDetails = await rpcClient.getMiDiagramRpcClient().getMediator({
                range: nodeRange,
                documentUri: node.documentUri,
                isEdit: true
            });

            const formJSON = connectorDetails;

            sidePanelContext.setSidePanelState({
                isOpen: true,
                operationName: "connector",
                nodeRange: nodeRange,
                isEditing: true,
                formValues: {
                    form: formJSON,
                    title: `${FirstCharToUpperCase(operationName)} Operation`,
                    uiSchemaPath: connectorData.uiSchemaPath,
                    parameters: connectorNode.parameters ?? [],
                    connectorName: connectorData.name,
                    operationName: operationName,
                    connectionName: connectorNode.configKey,
                    icon: iconPath,
                },
                parentNode: node.mediatorName,
                node: node,
                tag: node.stNode.tag
            });
        }
    }

    const handleOnConnectionClick = async (e: any) => {
        e.stopPropagation();

        const nodeRange = await getConnectionNodeRange();

        const connectorData = await rpcClient.getMiDiagramRpcClient().getAvailableConnectors({
            documentUri: node.documentUri,
            connectorName: node.stNode.tag.split(".")[0]
        });

        const definition = await rpcClient?.getMiDiagramRpcClient().getDefinition({
            document: {
                uri: node.documentUri,
            },
            position: nodeRange.start
        });

        if (e.ctrlKey || e.metaKey) {
            // open file of selected connection
            rpcClient.getMiDiagramRpcClient().openFile({ path: definition.uri, beside: true });

        } else if (node.isSelected()) {
            rpcClient.getMiVisualizerRpcClient().openView({
                type: POPUP_EVENT_TYPE.OPEN_VIEW,
                location: {
                    documentUri: definition.uri,
                    view: MACHINE_VIEW.ConnectionForm,
                    customProps: {
                        connectionName: connectorNode.configKey,
                        connector: connectorData
                    }
                },
                isPopup: true
            });
        }
    }

    return (
        <div data-testid={`connectorNode-${node.getID()}`}>
            <Tooltip content={!isPopoverOpen && tooltip ? <TooltipEl /> : ""} position={'bottom'} containerPosition={'absolute'}>
                <S.Node
                    selected={node.isSelected()}
                    hasError={hasDiagnotics}
                    hovered={isHovered || isActiveBreakpoint}
                    isActiveBreakpoint={isActiveBreakpoint}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={(e) => handleOnClick(e)}
                >
                    {hasBreakpoint && (
                        <div style={{ position: "absolute", left: -5, width: 15, height: 15, borderRadius: "50%", backgroundColor: "red" }}></div>
                    )}
                    <S.TopPortWidget port={node.getPort("in")!} engine={engine} />
                    <div style={{ display: "flex", flexDirection: "row", width: NODE_DIMENSIONS.DEFAULT.WIDTH }}>
                        {iconPath &&
                            <S.IconContainer><img src={iconPath} alt="Icon" /></S.IconContainer>
                        }
                        <div>
                            {isHovered && (
                                <OptionsMenu appearance="icon" onClick={handleOnClickMenu}>
                                    <MoreVertIcon />
                                </OptionsMenu>
                            )}
                            <Content>
                                <Header showBorder={true}>
                                    <Name>{FirstCharToUpperCase(connectorNode.method)}</Name>
                                </Header>
                                <Body>
                                    <Description>{FirstCharToUpperCase(connectorNode.connectorName)}</Description>
                                </Body>
                            </Content>
                        </div>
                    </div>
                    <S.BottomPortWidget port={node.getPort("out")!} engine={engine} />
                </S.Node>
            </Tooltip>
            {connectorNode.configKey &&
                <S.CircleContainer
                    onMouseEnter={() => setIsHoveredConnector(true)}
                    onMouseLeave={() => setIsHoveredConnector(false)}
                    onClick={(e) => handleOnConnectionClick(e)}
                >
                    <Tooltip content={!isPopoverOpen && tooltip ? <TooltipEl /> : ""} position={'bottom'} >
                        <svg width={NODE_DIMENSIONS.CONNECTOR.CONNECTION_PART_WIDTH} height="50" viewBox="0 0 103 40">
                            <circle
                                cx="80"
                                cy="20"
                                r="22"
                                fill={Colors.SURFACE_BRIGHT}
                                stroke={(isHoveredConnector || isConnectorSelected) ? Colors.SECONDARY : Colors.OUTLINE_VARIANT}
                                strokeWidth={2}
                            />

                            {connectionIconPath && <g transform="translate(68,7)">
                                <foreignObject width="25" height="25">
                                    <img src={connectionIconPath} alt="Icon" />
                                </foreignObject>
                            </g>}

                            <line
                                x1="0"
                                y1="20"
                                x2="57"
                                y2="20"
                                style={{
                                    stroke: Colors.PRIMARY,
                                    strokeWidth: 2,
                                    markerEnd: `url(#${node.getID()}-arrow-head)`,
                                }}
                            />
                            <defs>
                                <marker
                                    markerWidth="4"
                                    markerHeight="4"
                                    refX="3"
                                    refY="2"
                                    viewBox="0 0 4 4"
                                    orient="auto"
                                    id={`${node.getID()}-arrow-head`}
                                >
                                    <polygon points="0,4 0,0 4,2" fill={Colors.PRIMARY}></polygon>
                                </marker>
                            </defs>
                        </svg>
                    </Tooltip>
                </S.CircleContainer>
            }
            {connectorNode.configKey &&
                <S.ConnectionContainer>
                    <S.ConnectionText>
                        {connectorNode.configKey}
                    </S.ConnectionText>
                </S.ConnectionContainer>}
            <Popover
                anchorEl={popoverAnchorEl}
                open={isPopoverOpen}
                sx={{
                    backgroundColor: Colors.SURFACE,
                    marginLeft: "30px",
                    padding: 0
                }}
            >
                <ClickAwayListener onClickAway={handlePopoverClose}>
                    <Menu>
                        <MenuItem key={'delete-btn'} item={{ label: 'Delete', id: "delete", onClick: () => node.delete(rpcClient, setDiagramLoading) }} />
                        <BreakpointMenu hasBreakpoint={hasBreakpoint} node={node} rpcClient={rpcClient} />
                    </Menu>
                </ClickAwayListener>
            </Popover>

        </div >
    );
}
