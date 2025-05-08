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

export const SUCCESS_LABEL_SVG_WIDTH_WITH_SHADOW = 65;
export const SUCCESS_LABEL_SVG_HEIGHT_WITH_SHADOW = 31;
export const SUCCESS_LABEL_SVG_WIDTH = 59;
export const SUCCESS_LABEL_SVG_HEIGHT = 25;
export const SUCCESS_LABEL_SHADOW_OFFSET = SUCCESS_LABEL_SVG_HEIGHT_WITH_SHADOW - SUCCESS_LABEL_SVG_HEIGHT;

export function ConnectionSuccessSVG(props: { x: number, y: number, text: string }) {
    const { text, ...xyProps } = props;
    return (
        <svg {...xyProps} width={SUCCESS_LABEL_SVG_WIDTH_WITH_SHADOW} height={SUCCESS_LABEL_SVG_HEIGHT_WITH_SHADOW}>
            <defs>
                <linearGradient
                    id="ConnectionSuccessLinearGradient"
                    x1="0.484"
                    y1="-0.403"
                    x2="0.484"
                    y2="1.128"
                    gradientUnits="objectBoundingBox"
                >
                    <stop offset="0" stopColor="#53c08a" />
                    <stop offset="1" stopColor="#2fa86c" />
                </linearGradient>
                <filter
                    id="ConnectionSuccessFilter"
                    x="0"
                    y="0"
                    width={SUCCESS_LABEL_SVG_WIDTH_WITH_SHADOW}
                    height={SUCCESS_LABEL_SVG_HEIGHT_WITH_SHADOW}
                    filterUnits="userSpaceOnUse"
                >
                    <feOffset dy="1" in="SourceAlpha" />
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feFlood floodColor="#8a92ab" floodOpacity="0.373" />
                    <feComposite operator="in" in2="blur" />
                    <feComposite in="SourceGraphic" />
                </filter>
            </defs>
            <g id="Success" transform="translate(3 2)">
                <g transform="matrix(1, 0, 0, 1, -3, -2)" filter="url(#ConnectionSuccessFilter)">
                    <rect
                        id="SuccessRect"
                        width={SUCCESS_LABEL_SVG_WIDTH}
                        height={SUCCESS_LABEL_SVG_HEIGHT}
                        rx="4"
                        transform="translate(3 2)"
                        fill="url(#ConnectionSuccessLinearGradient)"
                    />
                </g>
                <text
                    className="metrics-text"
                    id="Success_text"
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
