/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { DiagramEngine } from "@projectstorm/react-diagrams";

import { useGraphQlContext } from "../../../DiagramContext/GraphqlDiagramContext";
import { GraphqlBasePortWidget } from "../../../Port/GraphqlBasePortWidget";
import { Interaction } from "../../../resources/model";
import { FieldName, NodeFieldContainer } from "../../../resources/styles/styles";
import { InterfaceNodeModel } from "../InterfaceNodeModel";

interface InterfaceImplWidgetProps {
    engine: DiagramEngine;
    node: InterfaceNodeModel;
    field: Interaction;
}

export function InterfaceImplWidget(props: InterfaceImplWidgetProps) {
    const { engine, node, field } = props;
    const { setSelectedNode } = useGraphQlContext();

    const updateSelectedNode = () => {
        setSelectedNode(field.componentName);
    }

    return (
        <div onClick={updateSelectedNode}>
            <NodeFieldContainer>
                <GraphqlBasePortWidget
                    port={node.getPort(`left-${field.componentName}`)}
                    engine={engine}
                />
                <FieldName data-testid={`interface-implementation-${field.componentName}`}>{field.componentName}</FieldName>
                <GraphqlBasePortWidget
                    port={node.getPort(`right-${field.componentName}`)}
                    engine={engine}
                />
            </NodeFieldContainer>
        </div>
    );
}
