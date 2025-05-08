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

import { NodeContainer } from "../../resources/styles/styles";

import { HierarchicalHeadWidget } from "./HierarchicalHead";
import { HierarchicalNodeModel } from "./HierarchicalNodeModel";
import { ResourceField } from "./ResourceField";

interface HierarchicalNodeWidgetProps {
    node: HierarchicalNodeModel;
    engine: DiagramEngine;
}

export function HierarchicalNodeWidget(props: HierarchicalNodeWidgetProps) {
    const { node, engine } = props;

    return (
        <NodeContainer data-testid={`hierarchical-node-${node?.resourceObject?.name}`}>
            <HierarchicalHeadWidget node={node} engine={engine}/>
            {node.resourceObject.hierarchicalResources?.map((resource, index) => {
                return (
                    <ResourceField key={index} node={node} engine={engine} resource={resource}/>
                );
            })}

        </NodeContainer>
    );
}
