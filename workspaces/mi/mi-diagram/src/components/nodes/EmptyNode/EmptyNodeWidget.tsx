/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import styled from "@emotion/styled";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { EmptyNodeModel } from "./EmptyNodeModel";
import { Colors } from "../../../resources/constants";

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace S {
    export type NodeProps = {
        visible: boolean;
    };
    export const Node = styled.div<NodeProps>`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: ${(props: NodeProps) => (props.visible ? 8 : 8)}px;
        height: ${(props: NodeProps) => (props.visible ? 8 : 0)}px;
        border: 2px solid ${(props: NodeProps) => (props.visible ? Colors.PRIMARY : "transparent")};
        background-color: ${Colors.SURFACE_BRIGHT};
        border-radius: 50%;
    `;

    export const TopPortWidget = styled(PortWidget)`
        margin-top: -2px;
    `;

    export const BottomPortWidget = styled(PortWidget)`
        margin-bottom: -2px;
    `;
}

interface EmptyNodeWidgetProps {
    node: EmptyNodeModel;
    engine: DiagramEngine;
}

export function EmptyNodeWidget(props: EmptyNodeWidgetProps) {
    const { node, engine } = props;

    return (
        <>
            <S.TopPortWidget port={node.getPort("in")!} engine={engine} />
            <S.BottomPortWidget port={node.getPort("out")!} engine={engine} />
        </>
    );
}
