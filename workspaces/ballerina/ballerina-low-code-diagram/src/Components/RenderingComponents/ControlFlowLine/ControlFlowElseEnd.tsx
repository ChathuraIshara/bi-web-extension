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

import { BOTTOM_CURVE_SVG_HEIGHT, BOTTOM_CURVE_SVG_WIDTH } from '../IfElse/Else/BottomCurve';

import { ControlFlowBottomCurveSVG } from './ControlFlowBottomCurveSVG';
import { ControlFlowLineSVG } from './ControlFlowLineSVG';

export interface ControlFlowElseEndProp {
    x: number;
    y: number;
    h: number;
    w: number;
}

export default function ControlFlowElseEnd(props: ControlFlowElseEndProp) {
    const { h, w, x, y } = props;

    return (
        <g className="control-flow-line">
            <ControlFlowLineSVG
                x1={x}
                y1={y}
                x2={x + w - BOTTOM_CURVE_SVG_WIDTH}
                y2={y}
            />
            <ControlFlowBottomCurveSVG
                x={x + w - BOTTOM_CURVE_SVG_WIDTH}
                y={y - BOTTOM_CURVE_SVG_HEIGHT}
                width={BOTTOM_CURVE_SVG_WIDTH}
                height={BOTTOM_CURVE_SVG_HEIGHT}
            />
            <ControlFlowLineSVG
                x1={x + w}
                y1={y - BOTTOM_CURVE_SVG_HEIGHT - h}
                x2={x + w}
                y2={y - BOTTOM_CURVE_SVG_HEIGHT}
            />
        </g>
    );
}
