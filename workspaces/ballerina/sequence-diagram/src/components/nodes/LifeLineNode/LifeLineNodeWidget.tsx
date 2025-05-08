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
import { LifeLineNodeModel } from "./LifeLineNodeModel";
import { BORDER_WIDTH } from "../../../resources/constants";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";
namespace LifeLineNodeStyles {
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

interface LifeLineNodeWidgetProps {
    node: LifeLineNodeModel;
    engine: DiagramEngine;
}

export function LifeLineNodeWidget(props: LifeLineNodeWidgetProps) {
    const { node } = props;

    return (
        <LifeLineNodeStyles.Box width={node.width} height={node.height}>
            <svg width={node.width} height={node.height}>
                <rect
                    width={node.width}
                    height={node.height}
                    strokeWidth={BORDER_WIDTH}
                    fill={ThemeColors.OUTLINE_VARIANT}
                    rx="4"
                />
            </svg>
        </LifeLineNodeStyles.Box>
    );
}
