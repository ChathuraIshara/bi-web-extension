/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useRef } from "react";

import { DiagramEngine, PortModel } from "@projectstorm/react-diagrams";

import { useGraphQlContext } from "../../../DiagramContext/GraphqlDiagramContext";
import { GraphqlBasePortWidget } from "../../../Port/GraphqlBasePortWidget";
import { Interaction } from "../../../resources/model";
import { FieldName, NodeFieldContainer } from "../../../resources/styles/styles";
import { UnionNodeModel } from "../UnionNodeModel";

interface UnionFieldProps {
    engine: DiagramEngine;
    node: UnionNodeModel;
    unionField: Interaction;
}

export function UnionField(props: UnionFieldProps) {
    const { engine, node, unionField } = props;
    const { setSelectedNode } = useGraphQlContext();

    const functionPorts = useRef<PortModel[]>([]);

    const field = unionField.componentName;

    useEffect(() => {
        functionPorts.current.push(node.getPortFromID(`left-${field}`));
        functionPorts.current.push(node.getPortFromID(`right-${field}`));
    }, [unionField]);

    const updateSelectedNode = () => {
        setSelectedNode(field);
    }

    return (
        <div onClick={updateSelectedNode}>
            <NodeFieldContainer>
                <GraphqlBasePortWidget
                    port={node.getPort(`left-${field}`)}
                    engine={engine}
                />
                <FieldName style={{ marginLeft: '7px' }} data-testid={`union-field-${field}`}>
                    {field}
                </FieldName>
                <GraphqlBasePortWidget
                    port={node.getPort(`right-${field}`)}
                    engine={engine}
                />
            </NodeFieldContainer>
        </div>
    );
}
