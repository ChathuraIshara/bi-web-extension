/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx
import React from 'react';

import { TOP_CURVE_SVG_HEIGHT, TOP_CURVE_SVG_WIDTH } from '../IfElse/Else/TopCurve';

import { ControlFlowLineSVG } from './ControlFlowLineSVG';
import { ControlFlowTopCurveSVG } from './ControlFlowTopCurveSVG';
export interface ControlFlowElseStartProp {
    x: number;
    y: number;
    h: number;
    w: number;
}

export default function ControlFlowElseStart(props: ControlFlowElseStartProp) {
    const { h, w, x, y } = props;

    return (
        <g className="control-flow-line">
            <ControlFlowTopCurveSVG
                x={x + w - TOP_CURVE_SVG_WIDTH}
                y={y}
                width={TOP_CURVE_SVG_WIDTH}
                height={TOP_CURVE_SVG_HEIGHT}
            />
            <ControlFlowLineSVG
                x1={x + w}
                y1={y + TOP_CURVE_SVG_HEIGHT}
                x2={x + w}
                y2={y + h + TOP_CURVE_SVG_HEIGHT}
            />
            <ControlFlowLineSVG
                x1={x}
                y1={y}
                x2={x + w - TOP_CURVE_SVG_WIDTH}
                y2={y}
            />
        </g>
    );
}
