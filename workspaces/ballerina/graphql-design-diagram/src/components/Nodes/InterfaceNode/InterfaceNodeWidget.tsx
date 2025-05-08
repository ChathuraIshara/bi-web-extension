/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js
import React from "react";

import { DiagramEngine } from "@projectstorm/react-diagrams";

import { useGraphQlContext } from "../../DiagramContext/GraphqlDiagramContext";
import { NodeContainer, NodeFieldContainer } from "../../resources/styles/styles";
import { getComponentName } from "../../utils/common-util";

import { InterfaceHeadWidget } from "./InterfaceHead/InterfaceHead";
import { InterfaceImplWidget } from "./InterfaceImplementation/InterfaceImplementation";
import { InterfaceNodeModel } from "./InterfaceNodeModel";
import { ResourceFunctionCard } from "./ResourceFunctionCard/ResourceFunctionCard";

interface InterfaceNodeWidgetProps {
    node: InterfaceNodeModel;
    engine: DiagramEngine;
}

export function InterfaceNodeWidget(props: InterfaceNodeWidgetProps) {
    const { node, engine } = props;
    const { selectedDiagramNode } = useGraphQlContext();
    const isNodeSelected = selectedDiagramNode &&  getComponentName(selectedDiagramNode) === node.interfaceObject.name;

    return (
        <NodeContainer isSelected={isNodeSelected} data-testid={`interface-node-${node?.interfaceObject?.name}`}>
            <InterfaceHeadWidget node={node} engine={engine}/>
            {node.interfaceObject.resourceFunctions?.map((resourceFunction, index) => {
                return (
                    <ResourceFunctionCard key={index} node={node} engine={engine} functionElement={resourceFunction}/>
                );
            })}
            {node.interfaceObject.possibleTypes.length > 0 && (
                <NodeFieldContainer>
                    <div>Implementations</div>
                </NodeFieldContainer>
            )}
            {node.interfaceObject.possibleTypes.map((possibleType, index) => {
                return (
                    <InterfaceImplWidget key={index} node={node} engine={engine} field={possibleType}/>
                );
            })}
        </NodeContainer>
    );
}
