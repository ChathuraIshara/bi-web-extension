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
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";
import { EmptyNodeModel } from "./EmptyNodeModel";
import { BORDER_WIDTH, EMPTY_NODE_WIDTH } from "../../../resources/constants";

namespace EmptyNodeStyles {
    export const Node = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    export type CircleStyleProp = {
        show: boolean;
    };
    export const Circle = styled.div<CircleStyleProp>`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: ${(props: CircleStyleProp) => (props.show ? EMPTY_NODE_WIDTH : 0)}px;
        height: ${(props: CircleStyleProp) => (props.show ? EMPTY_NODE_WIDTH : 0)}px;
        border: ${BORDER_WIDTH}px solid ${(props: CircleStyleProp) => (props.show ? ThemeColors.PRIMARY : "transparent")};
        border-radius: 50%;
        background-color: ${(props: CircleStyleProp) => (props.show ? ThemeColors.PRIMARY_CONTAINER : "transparent")};
    `;

    export const TopPortWidget = styled(PortWidget)``;

    export const BottomPortWidget = styled(PortWidget)``;
}

interface EmptyNodeWidgetProps {
    node: EmptyNodeModel;
    engine: DiagramEngine;
}

export function EmptyNodeWidget(props: EmptyNodeWidgetProps) {
    const { node, engine } = props;

    return (
        <EmptyNodeStyles.Node>
            <EmptyNodeStyles.Circle show={node.isVisible()}>
                <EmptyNodeStyles.TopPortWidget port={node.getLeftPort()!} engine={engine} />
                <EmptyNodeStyles.BottomPortWidget port={node.getRightPort()!} engine={engine} />
            </EmptyNodeStyles.Circle>
        </EmptyNodeStyles.Node>
    );
}
