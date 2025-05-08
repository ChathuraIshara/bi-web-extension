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

export const FAILED_LABEL_SVG_WIDTH_WITH_SHADOW = 65;
export const FAILED_LABEL_SVG_HEIGHT_WITH_SHADOW = 31;
export const FAILED_LABEL_SVG_WIDTH = 59;
export const FAILED_LABEL_SVG_HEIGHT = 25;
export const FAILED_LABEL_SHADOW_OFFSET = FAILED_LABEL_SVG_HEIGHT_WITH_SHADOW - FAILED_LABEL_SVG_HEIGHT;

export function ConnectionFailedSVG(props: { x: number, y: number, text: string }) {
    const { text, ...xyProps } = props;
    return (
        <svg {...xyProps} width={FAILED_LABEL_SVG_WIDTH_WITH_SHADOW} height={FAILED_LABEL_SVG_HEIGHT_WITH_SHADOW}>
            <defs>
                <linearGradient
                    id="ConnectionFailedLinearGradient"
                    x1="0.484"
                    y1="-0.403"
                    x2="0.484"
                    y2="1.128"
                    gradientUnits="objectBoundingBox"
                >
                    <stop offset="0" stopColor="#FFCC8C" />
                    <stop offset="1" stopColor="#FF9D52" />
                </linearGradient>
                <filter
                    id="ConnectionFailedFilter"
                    x="0"
                    y="0"
                    width={FAILED_LABEL_SVG_WIDTH_WITH_SHADOW}
                    height={FAILED_LABEL_SVG_HEIGHT_WITH_SHADOW}
                    filterUnits="userSpaceOnUse"
                >
                    <feOffset dy="1" in="SourceAlpha" />
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feFlood floodColor="#FFCC8C" floodOpacity="0.373" />
                    <feComposite operator="in" in2="blur" />
                    <feComposite in="SourceGraphic" />
                </filter>
            </defs>
            <g id="Failed" transform="translate(3 2)">
                <g transform="matrix(1, 0, 0, 1, -3, -2)" filter="url(#ConnectionFailedFilter)">
                    <rect
                        id="FailedRect"
                        width={FAILED_LABEL_SVG_WIDTH}
                        height={FAILED_LABEL_SVG_HEIGHT}
                        rx="4"
                        transform="translate(3 2)"
                        fill="url(#ConnectionFailedLinearGradient)"
                    />
                </g>
                <text
                    className="metrics-text"
                    id="Failed_text"
                    transform="translate(30.5 16)"
                >
                    <tspan x="0" y="0" textAnchor="middle">
                        {text}
                    </tspan>
                </text>
            </g>
        </svg>
    )
}
