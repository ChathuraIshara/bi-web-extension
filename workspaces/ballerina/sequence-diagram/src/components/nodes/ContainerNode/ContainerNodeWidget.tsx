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
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { ContainerNodeModel } from "./ContainerNodeModel";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";
// this node is represent the if-else block of a sequence diagram

namespace ContainerNodeStyles {
    export type BoxStyleProp = {
        width: number;
        height: number;
    };
    export const Box = styled.div<BoxStyleProp>`
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${(props: BoxStyleProp) => props.width}px;
        height: ${(props: BoxStyleProp) => props.height}px;
    `;
}

interface ContainerNodeWidgetProps {
    node: ContainerNodeModel;
    engine: DiagramEngine;
}

export function ContainerNodeWidget(props: ContainerNodeWidgetProps) {
    const { node } = props;

    return (
        <ContainerNodeStyles.Box width={node.width} height={node.height}>
            <svg width={node.width} height={node.height}>
                <rect
                    width={node.width}
                    height={node.height}
                    stroke={ThemeColors.PRIMARY}
                    strokeWidth={2.5}
                    fill="none"
                    rx="10"
                    ry="10"
                    strokeDasharray="5,5"
                />
                {node.label && (
                    <text
                        x={10}
                        y={14}
                        textAnchor="left"
                        dominantBaseline="middle"
                        fill={ThemeColors.PRIMARY}
                        fontFamily="monospace"
                    >
                        {node.label}
                    </text>
                )}
                {node.breakpointPercent > 0 && (
                    <line
                        x1="0"
                        y1={(node.height * node.breakpointPercent) / 100}
                        x2={node.width}
                        y2={(node.height * node.breakpointPercent) / 100}
                        stroke={ThemeColors.PRIMARY}
                        strokeWidth={2}
                        strokeDasharray="5,5"
                    />
                )}
            </svg>
        </ContainerNodeStyles.Box>
    );
}
