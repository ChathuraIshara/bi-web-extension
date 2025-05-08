/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useContext, useEffect, useState } from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { EntityModel } from './EntityModel';
import { EntityLinkModel } from '../EntityLink/EntityLinkModel';
import { EntityPortWidget } from '../EntityPort/EntityPortWidget';
import { EntityHeadWidget } from './EntityHead/EntityHead';
import { AttributeWidget } from './Attribute/AttributeCard';
import { EntityNode, InclusionPortsContainer } from './styles';
import { DiagramContext } from '../DiagramContext/DiagramContext';

interface EntityWidgetProps {
    node: EntityModel;
    engine: DiagramEngine;
}

export function EntityWidget(props: EntityWidgetProps) {
    const { node, engine } = props;
    const { collapsedMode, selectedNodeId, setHasDiagnostics, setSelectedNodeId, focusedNodeId, setFocusedNodeId } = useContext(DiagramContext);
    const [selectedLink, setSelectedLink] = useState<EntityLinkModel>(undefined);
    const [isCollapsed, setCollapsibleStatus] = useState<boolean>(collapsedMode);

    useEffect(() => {
        node.registerListener({
            'SELECT': (event: any) => {
                setSelectedLink(event.entity as EntityLinkModel);
            },
            'UNSELECT': () => { setSelectedLink(undefined) }
        })
    }, [node]);

    useEffect(() => {
        setCollapsibleStatus(collapsedMode);
    }, [collapsedMode])

    useEffect(() => {
        engine.getModel().getLinks().forEach((link) => {
            const entityLink: EntityLinkModel = link as EntityLinkModel;
            if (entityLink.sourceNode?.nodeId === node.getID()) {
                const attributeId: string = `${node.getID()}/${entityLink.sourceNode.attributeId}`;
                if (isCollapsed && entityLink.getSourcePort().getID() !== `right-${node.getID()}`) {
                    link.setSourcePort(node.getPort(`right-${node.getID()}`));
                } else if (!isCollapsed &&
                    node.getPort(`right-${attributeId}`) &&
                    entityLink.getSourcePort().getID() !== `right-${attributeId}`
                ) {
                    link.setSourcePort(node.getPort(`right-${attributeId}`));
                }
            } else if (entityLink.targetNode?.nodeId === node.getID()) {
                const attributeId: string = `${node.getID()}/${entityLink.targetNode.attributeId}`;
                if (isCollapsed && entityLink.getTargetPort().getID() !== `left-${node.getID()}`) {
                    link.setTargetPort(node.getPort(`left-${node.getID()}`));
                } else if (!isCollapsed &&
                    node.getPort(`left-${attributeId}`) &&
                    entityLink.getTargetPort().getID() !== `left-${attributeId}`
                ) {
                    link.setTargetPort(node.getPort(`left-${node.getID()}/${entityLink.targetNode.attributeId}`));
                }
            }
        });
        engine.repaintCanvas();
    }, [isCollapsed]);

    if (node.entityObject.diagnostics.length) {
        setHasDiagnostics(true);
    }

    const handleOnHeaderWidgetClick = () => {
        setSelectedNodeId(node.getID());
        setFocusedNodeId(undefined);
    }

    return (
        <EntityNode
            isAnonymous={node.entityObject.isAnonymous}
            isSelected={node.getID() === selectedNodeId || node.isNodeSelected(selectedLink, node.getID())}
            isFocused={node.getID() === focusedNodeId}
        >
            <EntityHeadWidget
                engine={engine}
                node={node}
                isSelected={node.getID() === selectedNodeId || node.isNodeSelected(selectedLink, node.getID())}
                onClick={handleOnHeaderWidgetClick}
                isCollapsed={isCollapsed}
                setCollapsedStatus={setCollapsibleStatus}
            />

            {!isCollapsed && (
                node.entityObject.attributes.map((attribute, index) => {
                    return (
                        <AttributeWidget
                            key={index}
                            engine={engine}
                            node={node}
                            attribute={attribute}
                            isSelected={node.isNodeSelected(selectedLink, `${node.getID()}/${attribute.name}`)}
                        />
                    )
                })
            )}

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
    );
}
