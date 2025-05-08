/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import * as React from "react";

import { ARROW_HEIGHT, ARROW_WIDTH } from "../ArrowHead";

import './style.scss';

export function ControlFLowArrowSVG(props: { x1: number, y: number, x2: number, isDotted: boolean, isLeft?: boolean }) {
    const { isDotted, x1, x2, y, isLeft } = props;
    const pointX = isDotted ? x2 : x1;

    const pointsR = `${pointX - ARROW_HEIGHT},${y - ARROW_WIDTH} ${pointX - ARROW_HEIGHT},${y + ARROW_WIDTH} ${pointX},${y}  `;
    const pointsL = `${pointX + ARROW_HEIGHT},${y - ARROW_WIDTH} ${pointX + ARROW_HEIGHT},${y + ARROW_WIDTH} ${pointX},${y}  `;
    const points = isLeft ? pointsL : (isDotted ? pointsL : pointsR);
    return (
        <svg>
            <defs>
                <filter id="control_flow_glowing_filter" {...props} filterUnits="userSpaceOnUse">
                    <feOffset in="SourceAlpha" />
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood flood-color="#36b475" />
                    <feComposite operator="in" in2="blur" />
                    <feComposite in="SourceGraphic" />
                </filter>
            </defs>

            <g className="arrow-head">
                <polygon points={points} filter="url(#control_flow_glowing_filter)" />
            </g>
            <g>
                <line
                    className={isDotted ? "line-dashed" : "line"}
                    filter="url(#control_flow_glowing_filter)"
                    x1={x1}
                    y1={y}
                    x2={x2}
                    y2={y}
                    fill="none"
                    stroke="#36b475"
                    strokeMiterlimit="10"
                    strokeWidth="1"
                />
            </g>
        </svg>
    );
}

