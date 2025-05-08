/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { BlockViewState, CollapseViewState } from "../../../ViewState";
import { DefaultConfig } from "../../../Visitors";
import { COLLAPSE_SVG_HEIGHT, COLLAPSE_SVG_WIDTH } from "../ForEach/ColapseButtonSVG";

import { CollapseButtonSVG } from "./CollapseButtonSVG";
import { CollapsedComponentSVG } from "./CollapsedComponentSVG";
import { ExpandedContainer } from "./ExpandedContainer";

interface CollapseProps {
    collapseVS: CollapseViewState;
    onExpandClick?: () => void;
    onCollapseClick?: () => void;
}


export default function CollapseComponent(props: CollapseProps) {
    const { collapseVS, onExpandClick, onCollapseClick } = props;
    const x = collapseVS.bBox.cx;
    const y = collapseVS.bBox.cy;
    return (
        <g >
            {collapseVS.collapsed && <CollapsedComponentSVG x={x} y={y} onExpandClick={onExpandClick} />}
            {!collapseVS.collapsed && <ExpandedContainer collapseVS={collapseVS} onCollapseClick={onCollapseClick} />}
        </g>
    )
}
