/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import * as React from "react";

export const COUNTERLEFT_SVG_WIDTH = 125;
export const COUNTERLEFT_SVG_HEIGHT = 31;

export function CounterLeftSVG(props: { x: number, y: number, text: string }) {
    const { text, ...xyProps } = props;

    const maxTextWidth = text.length >= 25;
    return (
        <svg {...xyProps} width={COUNTERLEFT_SVG_WIDTH} height={COUNTERLEFT_SVG_HEIGHT}>
            <defs>
                <linearGradient
                    id="CounterLeftLinearGradient"
                    x1="0.5"
                    y1="-3.921"
                    x2="0.5"
                    y2="1.283"
                    gradientUnits="objectBoundingBox"
                >
                    <stop offset="0" stopColor="#8d91a3" />
                    <stop offset="1" stopColor="#32324d" />
                </linearGradient>
                <filter
                    id="CounterLeftFilter"
                    x="0"
                    y="0"
                    width={COUNTERLEFT_SVG_WIDTH}
                    height={COUNTERLEFT_SVG_HEIGHT}
                    filterUnits="userSpaceOnUse"
                >
                    <feOffset dy="1" in="SourceAlpha" />
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feFlood floodColor="#8a92ab" floodOpacity="0.373" />
                    <feComposite operator="in" in2="blur" />
                    <feComposite in="SourceGraphic" />
                </filter>
            </defs>
            <g id="CounterLeft" transform="translate(3 2)">
                <g transform="matrix(1.8, 0, 0, 1, -10, -2)" filter="url(#CounterLeftFilter)">
                    <path
                        id="CounterLeftRectangle"
                        d="M0,4A4,4,0,0,0-4,0H-61.949a4,4,0,0,0-4,4V8.7c0,2.252-4.051,3.8-4.051,3.8s4.051,1.611,4.051,
                        4.891V21a4,4,0,0,0,4,4H-4a4,4,0,0,0,4-4Z"
                        transform="translate(73 2)"
                        fill="url(#CounterLeftLinearGradient)"
                    />
                </g>
            </g>

            <g id="CounterLeft" transform="translate(25 2)">
                <text
                    className="metrics-text"
                    id="CounterLeftText"
                    transform="translate(37.5 16.078)"
                >
                    <tspan
                        x="0"
                        y="0"
                        textAnchor="middle"
                    >
                        {maxTextWidth ? text.slice(0, 5) + "... s" : text}
                    </tspan>
                </text>
            </g>
        </svg>
    )
}
