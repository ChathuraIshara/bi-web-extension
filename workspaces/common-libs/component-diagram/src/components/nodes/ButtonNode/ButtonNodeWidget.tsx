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
import { ButtonNodeModel } from "./ButtonNodeModel";
import {
    Colors,
    NODE_BORDER_WIDTH,
    CON_NODE_WIDTH,
    NEW_CONNECTION,
    CON_NODE_HEIGHT,
} from "../../../resources/constants";
import { Button } from "@wso2-enterprise/ui-toolkit";
import { useDiagramContext } from "../../DiagramContext";
import { DatabaseIcon, LinkIcon, PlusIcon } from "../../../resources";

export namespace NodeStyles {
    export type NodeStyleProp = {
        hovered: boolean;
        inactive?: boolean;
    };
    export const Node = styled.div<NodeStyleProp>`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: ${CON_NODE_WIDTH}px;
        height: ${CON_NODE_HEIGHT}px;
        color: ${Colors.ON_SURFACE};
        border: ${NODE_BORDER_WIDTH}px dashed
            ${(props: NodeStyleProp) => (props.hovered ? Colors.PRIMARY : Colors.OUTLINE_VARIANT)};
        border-radius: 40px;
        background-color: ${Colors.SURFACE_DIM};
        cursor: pointer;
    `;

    export const Header = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 6px;
        padding: 8px;
    `;

    export const Circle = styled.div<NodeStyleProp>`
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${CON_NODE_HEIGHT}px;
        height: ${CON_NODE_HEIGHT}px;
        
        color: ${Colors.ON_SURFACE};
    `;

    export const StyledButton = styled(Button)`
        border-radius: 5px;
        position: absolute;
        right: 6px;
    `;

    export const TopPortWidget = styled(PortWidget)`
        margin-top: -3px;
    `;

    export const BottomPortWidget = styled(PortWidget)`
        margin-bottom: -2px;
    `;

    export const StyledText = styled.div`
        font-size: 14px;
    `;

    export const Icon = styled.div<NodeStyleProp>`
        padding: 4px;
        svg {
            fill: ${(props: NodeStyleProp) => (props.hovered ? Colors.PRIMARY : Colors.ON_SURFACE)};
        }
    `;

    export const Title = styled(StyledText)<NodeStyleProp>`
        max-width: ${CON_NODE_WIDTH - 50}px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: "GilmerMedium";
        color: ${(props: NodeStyleProp) => (props.hovered ? Colors.PRIMARY : Colors.ON_SURFACE)};
        opacity: ${(props: NodeStyleProp) => (props.inactive && !props.hovered ? 0.7 : 1)};
    `;

    export const Description = styled(StyledText)`
        font-size: 12px;
        max-width: ${CON_NODE_WIDTH - 80}px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: monospace;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        color: ${Colors.ON_SURFACE};
        opacity: 0.7;
    `;

    export const Row = styled.div<NodeStyleProp>`
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding: 0 8px;
    `;

    export const Hr = styled.hr`
        width: 100%;
    `;
}

interface ButtonNodeWidgetProps {
    model: ButtonNodeModel;
    engine: DiagramEngine;
}

export interface NodeWidgetProps extends Omit<ButtonNodeWidgetProps, "children"> {}

export function ButtonNodeWidget(props: ButtonNodeWidgetProps) {
    const { model, engine } = props;
    const [isHovered, setIsHovered] = React.useState(false);
    const { onAddConnection, onConnectionSelect } = useDiagramContext();

    const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
        onAddConnection();
    };

    return (
        <NodeStyles.Node
            hovered={isHovered}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleOnClick}
        >
            <NodeStyles.TopPortWidget port={model.getPort("in")!} engine={engine} />
            <NodeStyles.Row hovered={isHovered}>
                <NodeStyles.Icon hovered={isHovered}>
                    <PlusIcon />
                </NodeStyles.Icon>
                <NodeStyles.Header>
                    <NodeStyles.Title hovered={isHovered}>{model.node.name}</NodeStyles.Title>
                </NodeStyles.Header>
            </NodeStyles.Row>
            <NodeStyles.BottomPortWidget port={model.getPort("out")!} engine={engine} />
        </NodeStyles.Node>
    );
}
