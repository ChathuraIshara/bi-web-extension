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
import { ActorNodeModel } from "./ActorNodeModel";
import { Colors, NODE_BORDER_WIDTH, ACTOR_NODE_WIDTH } from "../../../resources/constants";
import { Button } from "@wso2-enterprise/ui-toolkit";
import { AppIcon, PersonIcon, ClockIcon } from "../../../resources";

export namespace NodeStyles {
    export type NodeStyleProp = {
        hovered: boolean;
    };
    export const Node = styled.div<NodeStyleProp>`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: ${ACTOR_NODE_WIDTH}px;
        height: ${ACTOR_NODE_WIDTH}px;
        /* border: ${NODE_BORDER_WIDTH}px solid
            ${(props: NodeStyleProp) => (props.hovered ? Colors.PRIMARY : Colors.OUTLINE_VARIANT)}; */
        border-radius: 50%;
        background-color: ${Colors.SURFACE_DIM};
        color: ${Colors.ON_SURFACE};
        /* cursor: pointer; */
        & svg {
            fill: ${(props: NodeStyleProp) => (props.hovered ? Colors.PRIMARY : Colors.ON_SURFACE)};
            opacity: ${(props: NodeStyleProp) => (props.hovered ? 1 : 0.7)};
        }
    `;

    export const Header = styled.div<{}>`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2px;
        width: 100%;
        padding: 8px;
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

    export const Icon = styled.div`
        padding: 4px;
        svg {
            fill: ${Colors.ON_SURFACE};
        }
    `;

    export const Title = styled(StyledText)`
        max-width: ${ACTOR_NODE_WIDTH - 50}px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: "GilmerMedium";
    `;

    export const Description = styled(StyledText)`
        font-size: 12px;
        max-width: ${ACTOR_NODE_WIDTH - 80}px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: monospace;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        color: ${Colors.ON_SURFACE};
        opacity: 0.7;
    `;

    export const Row = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    `;

    export const Hr = styled.hr`
        width: 100%;
    `;
}

interface ActorNodeWidgetProps {
    model: ActorNodeModel;
    engine: DiagramEngine;
}

export interface NodeWidgetProps extends Omit<ActorNodeWidgetProps, "children"> {}

export function ActorNodeWidget(props: ActorNodeWidgetProps) {
    const { model, engine } = props;
    const [isHovered, setIsHovered] = React.useState(false);

    const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // event.stopPropagation();
    };

    const getNodeIcon = () => {
        switch (model.node.type) {
            case "trigger":
                return <AppIcon />;
            case "schedule-task":
                return <ClockIcon />;
            case "task":
            case "service":
            default:
                return <PersonIcon />;
        }
    };

    return (
        <NodeStyles.Node
            hovered={isHovered}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleOnClick}
        >
            <NodeStyles.TopPortWidget port={model.getPort("in")!} engine={engine} />
            <NodeStyles.Row>
                <NodeStyles.Header>
                    <NodeStyles.Icon>{getNodeIcon()}</NodeStyles.Icon>
                </NodeStyles.Header>
            </NodeStyles.Row>
            <NodeStyles.BottomPortWidget port={model.getPort("out")!} engine={engine} />
        </NodeStyles.Node>
    );
}
