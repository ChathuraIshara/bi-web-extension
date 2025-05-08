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

import { EnumField } from "../../../resources/model";
import { FieldName } from "../../../resources/styles/styles";
import { EnumNodeModel } from "../EnumNodeModel";
import { EnumFieldContainer } from "../styles";

interface EnumFieldCardProps {
    engine: DiagramEngine;
    node: EnumNodeModel;
    enumField: EnumField;
}

export function EnumFieldCard(props: EnumFieldCardProps) {
    const { engine, node, enumField } = props;

    return (
        <EnumFieldContainer>
            <FieldName data-testid={`enum-field-${enumField.name}`}>{enumField.name}</FieldName>
        </EnumFieldContainer>
    );
}
