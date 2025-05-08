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

import { ServiceClassHeadWidget } from "./ClassHead/ClassHead";
import { ServiceField } from "./FunctionCard/ServiceField";
import { ServiceClassNodeModel } from "./ServiceClassNodeModel";


interface ServiceClassNodeWidgetProps {
    node: ServiceClassNodeModel;
    engine: DiagramEngine;
}

export function ServiceClassNodeWidget(props: ServiceClassNodeWidgetProps) {
    const { node, engine } = props;
    const { selectedDiagramNode } = useGraphQlContext();

    const isNodeSelected = selectedDiagramNode &&  getComponentName(selectedDiagramNode) === node.classObject.serviceName;

    return (
        <NodeContainer isSelected={isNodeSelected} data-testid={`service-class-node-${node?.classObject?.serviceName}`}>
            <ServiceClassHeadWidget node={node} engine={engine} />
            {node.classObject.functions?.map((classFunction, index) => {
                return (
                    <ServiceField key={index} node={node} engine={engine} functionElement={classFunction} />
                );
            })}
        </NodeContainer>
    );
}
