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

export const CLIENT_SVG_WIDTH_WITH_SHADOW = 100;
export const CLIENT_SVG_HEIGHT_WITH_SHADOW = 100;
export const CLIENT_STROKE_HEIGHT = 1;
export const CLIENT_RADIUS = 24 + CLIENT_STROKE_HEIGHT ;
export const CLIENT_SVG_WIDTH = CLIENT_RADIUS * 2;
export const CLIENT_SVG_HEIGHT = CLIENT_RADIUS * 2;
export const CLIENT_SHADOW_OFFSET = CLIENT_SVG_HEIGHT_WITH_SHADOW - CLIENT_SVG_HEIGHT;

export function ConnectorSVG(props: { x: number, y: number }) {
    const { ...xyProps } = props;
    return (
        <svg {...xyProps} width={CLIENT_SVG_WIDTH_WITH_SHADOW} height={CLIENT_SVG_HEIGHT_WITH_SHADOW}>
            <defs>
                <linearGradient id="ConnectorLinearGradient" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#fcfcfd" />
                    <stop offset="1" stopColor="#f7f8fb" />
                </linearGradient>
                <filter id="ConnectorFilterDefault" x="-20" y="-20" width="142" height="142" filterUnits="userSpaceOnUse">
                    <feOffset dy="1" in="SourceAlpha"/>
                    <feGaussianBlur stdDeviation="2" result="blur"/>
                    <feFlood floodColor="#a9acb6" floodOpacity="0.388"/>
                    <feComposite operator="in" in2="blur"/>
                    <feComposite in="SourceGraphic"/>
                 </filter>
                <filter id="ConnectorFilterHover" x="-20" y="-20" width="142" height="142" filterUnits="userSpaceOnUse">
                    <feOffset dy="1" in="SourceAlpha" />
                    <feGaussianBlur stdDeviation="7.5" result="blur" />
                    <feFlood floodColor="#a9acb6" floodOpacity="0.388" />
                    <feComposite operator="in" in2="blur" />
                    <feComposite in="SourceGraphic" />
                </filter>
                <filter id="ConnectorFilterWaining" x="-20" y="-20" width="142" height="142" filterUnits="userSpaceOnUse">
                    <feOffset dy="1" in="SourceAlpha" />
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feFlood floodColor="#b0817d" floodOpacity="0.388" />
                    <feComposite operator="in" in2="blur" />
                    <feComposite in="SourceGraphic" />
                </filter>
            </defs>
            <g id="Connector" className="connector-group connector-group-active" transform="translate(7 5.5)">
                <g transform="matrix(1, 0, 0, 1, -29.5, -27)">
                    <g id="ConnectorOval" transform="translate(48 47)" >
                        <circle cx="24" cy="24" r="24" stroke="none" />
                        <circle cx="24" cy="24" r="24.5" fill="none" className="click-effect" />
                    </g>
                </g>
            </g>
        </svg>
    )
}
