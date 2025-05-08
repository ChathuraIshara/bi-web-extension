/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { PortWidget } from "@projectstorm/react-diagrams-core";
import { NodePortModel } from "./NodePortModel";
import styled from "@emotion/styled";

export namespace NodePortStyles {
    export const Port = styled.div`
        width: "10px";
        height: "10px";
        background-color: "#000";
        border-radius: "50%";
    `;
}

interface NodePortWidgetProps {
    port: NodePortModel;
    engine: any;
}

export const NodePortWidget: React.FC<NodePortWidgetProps> = ({ port, engine }) => {
    return (
        <PortWidget engine={engine} port={port}>
            <NodePortStyles.Port />
        </PortWidget>
    );
};
