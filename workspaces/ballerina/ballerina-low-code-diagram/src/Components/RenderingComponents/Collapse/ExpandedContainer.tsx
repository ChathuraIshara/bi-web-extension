/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";

import { CollapseViewState } from "../../../ViewState";
import { COLLAPSE_SVG_HEIGHT, COLLAPSE_SVG_WIDTH } from "../ForEach/ColapseButtonSVG";

import { CollapseButtonSVG } from "./CollapseButtonSVG";

interface ExpandedContainerProps {
    collapseVS: CollapseViewState;
    onCollapseClick?: () => void;
}

export function ExpandedContainer(props: ExpandedContainerProps) {
    const { collapseVS, onCollapseClick } = props;
    const [mouseOverExpand, setMouseOverExpand] = useState<boolean>(false);

    const x = collapseVS.bBox.cx;
    const y = collapseVS.bBox.cy;

    const onMouseOverExpandButton = () => {
        setMouseOverExpand(true);
    }

    const onMouseLeave = () => {
        setMouseOverExpand(false);
    }

    const containerFooter = (
        <line
            x1={x + collapseVS.bBox.lw - COLLAPSE_SVG_WIDTH / 2}
            y1={y + collapseVS.bBox.h}
            x2={x + collapseVS.bBox.lw + COLLAPSE_SVG_WIDTH / 2}
            y2={y + collapseVS.bBox.h}
            stroke={'#A6B3FF'}
            strokeWidth={1}
        />
    );

    const container = (
        <rect
            className="expanded-section-border"
            width={collapseVS.bBox.w}
            height={collapseVS.bBox.h - COLLAPSE_SVG_HEIGHT / 2}
            x={x}
            y={y + COLLAPSE_SVG_HEIGHT / 2}
            // stroke={'#5567D5'}
            opacity={0.4}
            fill={'#DCE1FF'}
            rx={6}
            // strokeDasharray={2}
        />
    );

    return (
        <g className="expanded-block">
            {mouseOverExpand && container}
            {!mouseOverExpand && containerFooter}
            <CollapseButtonSVG
                x={x + collapseVS.bBox.lw - COLLAPSE_SVG_HEIGHT / 2}
                y={y}
                onMouseEnter={onMouseOverExpandButton}
                onMouseLeave={onMouseLeave}
                onClick={onCollapseClick}
            />
        </g>
    );
}
