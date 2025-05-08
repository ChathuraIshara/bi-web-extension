/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useContext, useEffect, useState } from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { Codicon } from '@wso2-enterprise/ui-toolkit';

import { EntityModel } from './EntityModel';
import { EntityLinkModel } from '../EntityLink/EntityLinkModel';
import { EntityPortWidget } from '../EntityPort/EntityPortWidget';
import { EntityHeadWidget } from './EntityHead/EntityHead';
import { AttributeWidget } from './Attribute/AttributeCard';
import { EntityNode, InclusionPortsContainer, OperationSection } from './styles';
import { DiagramContext } from '../../common';
import styled from '@emotion/styled';
import { ThemeColors } from '@wso2-enterprise/ui-toolkit';
import { isNodeClass } from '../../../utils/model-mapper/entityModelMapper';

const HighlightedButton = styled.div`
    margin: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 8px;
    color: ${ThemeColors.PRIMARY};
    border: 1px dashed ${ThemeColors.PRIMARY};
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        border: 1px solid ${ThemeColors.HIGHLIGHT};
        background-color: ${ThemeColors.PRIMARY_CONTAINER};
    }
`;

export const AttributeHeader: React.FC<any> = styled.span`
    align-items: center;
    color: ${ThemeColors.ON_SURFACE};
    background-color: ${(props: { isSelected: boolean }) => props.isSelected ? ThemeColors.SURFACE_DIM_2 : ThemeColors.SURFACE_BRIGHT};
    display: flex;
    flex: 1;
    font-family: GilmerMedium;
    font-size: 12px;
    line-height: 30px;
    padding-left: 8px;
    text-align: left;
    padding-top: 8px;
`;


interface EntityWidgetProps {
    node: EntityModel;
    engine: DiagramEngine;
}

export function EntityWidget(props: EntityWidgetProps) {
    const { node, engine } = props;
    const { focusedNodeId, selectedNodeId, onEditNode } = useContext(DiagramContext);
    const [selectedLink, setSelectedLink] = useState<EntityLinkModel>(undefined);

    const onGraphqlEdit = () => {
        onEditNode(node.getID(), true);
    };

    const renderAttributes = () => {
        if (node.isGraphqlRoot) {
            const attributes: React.ReactNode[] = [];
            const categorizedFunctions = {
                query: [],
                mutation: [],
                subscription: [],
            };

            node.entityObject.functions?.forEach((func: any) => {
                if (func.kind === 'RESOURCE') {
                    if (func.accessor === 'subscribe') {
                        categorizedFunctions.subscription.push(func);
                    } else {
                        categorizedFunctions.query.push(func);
                    }
                } else if (func.kind === 'REMOTE') {
                    categorizedFunctions.mutation.push(func);
                }
            });

            const hasAnyOperations = categorizedFunctions.query.length > 0 
                || categorizedFunctions.mutation.length > 0 
                || categorizedFunctions.subscription.length > 0;

            if (!hasAnyOperations) {
                return (
                    <OperationSection>
                        <HighlightedButton onClick={onGraphqlEdit}>
                            <Codicon name="plus" />
                            Create Operations
                        </HighlightedButton>
                    </OperationSection>
                );
            }

            // Query section
            if (categorizedFunctions.query.length > 0) {
                attributes.push(
                    <div key="query-section">
                        <OperationSection>
                                <AttributeHeader>Query</AttributeHeader>
                            <div>
                                {categorizedFunctions.query.map((query: any) => (
                                    <AttributeWidget
                                        key={query.name}
                                        engine={engine}
                                        node={node}
                                        attribute={query}
                                        isSelected={node.isNodeSelected(selectedLink, `${node.getID()}/${query.name}`)}
                                    />
                                ))}
                            </div>
                        </OperationSection>
                    </div>
                );
            }

            // Mutation section
            if (categorizedFunctions.mutation.length > 0) {
                attributes.push(
                    <div key="mutation-section">
                        <OperationSection>
                                <AttributeHeader>Mutation</AttributeHeader>
                            <div>
                                {categorizedFunctions.mutation.map((mutation: any) => (
                                    <AttributeWidget
                                        key={mutation.name}
                                        engine={engine}
                                        node={node}
                                        attribute={mutation}
                                        isSelected={node.isNodeSelected(selectedLink, `${node.getID()}/${mutation.name}`)}
                                    />
                                ))}
                            </div>
                        </OperationSection>
                    </div>
                );
            }

            // Subscription section
            if (categorizedFunctions.subscription.length > 0) {
                attributes.push(
                    <div key="subscription-section">
                        <OperationSection>
                                <AttributeHeader>Subscription</AttributeHeader>
                            <div>
                                {categorizedFunctions.subscription.map((subscription: any) => (
                                    <AttributeWidget
                                        key={subscription.name}
                                        engine={engine}
                                        node={node}
                                        attribute={subscription}
                                        isSelected={node.isNodeSelected(selectedLink, `${node.getID()}/${subscription.name}`)}
                                    />
                                ))}
                            </div>
                        </OperationSection>
                    </div>
                );
            }

            return attributes;
        } else {
            const attributes: React.ReactNode[] = [];
            const members = isNodeClass(node.entityObject?.codedata?.node) ? node.entityObject.functions : node.entityObject.members; // Use functions if it's a CLASS
            if (members) {
                Object.entries(members).forEach(([key, member]) => (
                    attributes.push(
                        <AttributeWidget
                            key={key}
                            engine={engine}
                            node={node}
                            attribute={member}
                            isSelected={node.isNodeSelected(selectedLink, `${node.getID()}/${member.name}`)}
                        />
                    )
                ));
            }

            return attributes;
        }
    };

    useEffect(() => {
        node.registerListener({
            'SELECT': (event: any) => {
                setSelectedLink(event.entity as EntityLinkModel);
            },
            'UNSELECT': () => { setSelectedLink(undefined) }
        })
    }, [node])

    return (
        <>
            {node.getID() &&
                <EntityNode
                    isAnonymous={false}
                    isEditMode={false}
                    isSelected={node.isNodeSelected(selectedLink, node.getID()) || selectedNodeId === node.getID()}
                    shouldShade={false}
                    isFocused={node.getID() === focusedNodeId}
                >
                    <EntityHeadWidget
                        engine={engine}
                        node={node}
                        isSelected={node.isNodeSelected(selectedLink, node.getID()) || selectedNodeId === node.getID()}
                    />

                    {renderAttributes()}

                    <InclusionPortsContainer>
                        <EntityPortWidget
                            port={node.getPort(`top-${node.getID()}`)}
                            engine={engine}
                        />
                        <EntityPortWidget
                            port={node.getPort(`bottom-${node.getID()}`)}
                            engine={engine}
                        />
                    </InclusionPortsContainer>
                </EntityNode>
            }
        </>
    );
}
