/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";
import { EndNodeModel } from "./EndNodeModel";
import { END_NODE_WIDTH } from "../../../resources/constants";

namespace S {
    export const Node = styled.div<{}>`
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${END_NODE_WIDTH}px;
        height: ${END_NODE_WIDTH}px;
    `;

    export const Circle = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: ${END_NODE_WIDTH}px;
        height: ${END_NODE_WIDTH}px;
        background-color: ${ThemeColors.PRIMARY};
        border-radius: 50%;
    `;

    export const TopPortWidget = styled(PortWidget)`
        margin-top: -2px;
    `;

    export const BottomPortWidget = styled(PortWidget)`
        margin-bottom: -2px;
    `;
}

interface EndNodeWidgetProps {
    node: EndNodeModel;
    engine: DiagramEngine;
}

export function EndNodeWidget(props: EndNodeWidgetProps) {
    const { node, engine } = props;

    return (
        <S.Node>
            <S.Circle>
                <S.TopPortWidget port={node.getPort("in")!} engine={engine} />
            </S.Circle>
        </S.Node>
    );
}
