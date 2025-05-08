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

import './style.scss';

export function ControlFlowLineSVG(props: { x1: number, y1: number, x2: number, y2: number, isDotted?: boolean }) {
    const isDotted = props.isDotted;
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
            <g>
                <line
                    className={isDotted ? "line-dashed" : "line"}
                    filter="url(#control_flow_glowing_filter)"
                    x1={props.x1}
                    x2={props.x2}
                    y1={props.y1}
                    y2={props.y2}
                    fill="none"
                    stroke="#36b475"
                    strokeMiterlimit="10"
                    strokeWidth="1"
                />
            </g>
        </svg>
    );
}
