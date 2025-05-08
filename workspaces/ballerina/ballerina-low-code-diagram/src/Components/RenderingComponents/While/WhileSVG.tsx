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

import { STNode } from "@wso2-enterprise/syntax-tree";

import { ErrorSnippet } from "../../../Types/type";

import { WhileRectSVG } from "./WhileRectSVG";

export const WHILE_SVG_WIDTH_WITH_SHADOW = 66.686;
export const WHILE_SVG_HEIGHT_WITH_SHADOW = 66.686;
export const WHILE_SVG_WIDTH = 54.845;
export const WHILE_SVG_HEIGHT = 54.845;
export const WHILE_SHADOW_OFFSET = WHILE_SVG_HEIGHT_WITH_SHADOW - WHILE_SVG_HEIGHT;

export function WhileSVG(props: {
    x: number, y: number,
    openInCodeView?: () => void,
    codeSnippetOnSvg?: string,
    codeSnippet?: string,
    diagnostics?: ErrorSnippet,
    componentSTNode: STNode
}) {
    const { codeSnippet, openInCodeView, codeSnippetOnSvg, diagnostics, componentSTNode, ...xyProps } = props;
    return (
        <svg {...xyProps} width={WHILE_SVG_WIDTH_WITH_SHADOW} height={WHILE_SVG_HEIGHT_WITH_SHADOW}>
            <defs>
                <linearGradient id="WhileLinearGradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#fcfcfd" />
                    <stop offset="1" stopColor="#f7f8fb" />
                </linearGradient>
                <filter id="WhileFilterDefault" x="-20" y="-20" width="113.824" height="113.822" filterUnits="userSpaceOnUse">
                    <feOffset dy="1" in="SourceAlpha" />
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feFlood floodColor="#a9acb6" floodOpacity="0.388" />
                    <feComposite operator="in" in2="blur" />
                    <feComposite in="SourceGraphic" />
                </filter>
                <filter id="WhileFilterHover" x="-20" y="-20" width="146.824" height="146.822" filterUnits="userSpaceOnUse">
                    <feOffset dy="1" in="SourceAlpha" />
                    <feGaussianBlur stdDeviation="7.5" result="blur" />
                    <feFlood floodColor="#a9acb6" floodOpacity="0.388" />
                    <feComposite operator="in" in2="blur" />
                    <feComposite in="SourceGraphic" />
                </filter>
            </defs>
            (
            <WhileRectSVG
                onClick={openInCodeView}
                model={componentSTNode}
                diagnostic={diagnostics}
            />
            )
        </svg>
    )
}
