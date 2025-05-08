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
import { RecordField } from "../../../resources/model";
import { FieldName, FieldType } from "../../../resources/styles/styles";
import { RecordNodeModel } from "../RecordNodeModel";
import { RecordFieldContainer } from "../styles";

interface RecordFieldWidgetProps {
    engine: DiagramEngine;
    node: RecordNodeModel;
    field: RecordField;
}

export function RecordFieldWidget(props: RecordFieldWidgetProps) {
    const { engine, node, field } = props;
    const { setSelectedNode } = useGraphQlContext();

    const updateSelectedNode = () => {
        setSelectedNode(field.type);
    }

    return (
        <RecordFieldContainer data-testid={`record-field-${field.name}`}>
            <GraphqlBasePortWidget
                port={node.getPort(`left-${field.name}`)}
                engine={engine}
            />
            <FieldName data-testid={`record-field-name-${field.name}`}>{field.name}</FieldName>
            <div onClick={updateSelectedNode}>
                <FieldType data-testid={`record-field-type-${field.type}`}>{field.type}</FieldType>
            </div>
            <GraphqlBasePortWidget
                port={node.getPort(`right-${field.name}`)}
                engine={engine}
            />
        </RecordFieldContainer>
    );
}
