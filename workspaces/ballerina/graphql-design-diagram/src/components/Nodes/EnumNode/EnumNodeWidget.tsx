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
import { NodeContainer } from "../../resources/styles/styles";
import { getComponentName } from "../../utils/common-util";

import { EnumFieldCard } from "./EnumFieldCard/EnumFieldCard";
import { EnumHeadWidget } from "./EnumHead/EnumHead";
import { EnumNodeModel } from "./EnumNodeModel";

interface EnumNodeWidgetProps {
    node: EnumNodeModel;
    engine: DiagramEngine;
}

export function EnumNodeWidget(props: EnumNodeWidgetProps) {
    const { node, engine } = props;
    const { selectedDiagramNode } = useGraphQlContext();
    const isNodeSelected = selectedDiagramNode &&  getComponentName(selectedDiagramNode) === node.enumObject.name;

    return (
        <NodeContainer isSelected={isNodeSelected} data-testid={`enum-node-${node?.enumObject?.name}`}>
            <EnumHeadWidget
                engine={engine}
                node={node}
            />
            {node.enumObject.enumFields.map((enumField, index) => {
                return (
                    <EnumFieldCard key={index} engine={engine} node={node} enumField={enumField}/>
                );
            })
            }
        </NodeContainer>
    );
}
