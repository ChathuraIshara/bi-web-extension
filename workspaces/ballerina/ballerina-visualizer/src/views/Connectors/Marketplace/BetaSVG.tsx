/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

export const BETA_SVG_WIDTH = 26;
export const BETA_SVG_HEIGHT = 12;

export function BetaSVG({ width = 40, height = 16 }) {
    return (
        <svg width={width} height={height} viewBox="0 0 40 16" xmlns="http://www.w3.org/2000/svg">
            <rect
                width="40"
                height="16"
                rx="8"
                fill="#4A90E2"
                opacity={0.5}
            />
            <text
                x="50%"
                y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="var(--vscode-keybindingLabel-foreground)"
                fontSize="12"
                fontFamily="'Roboto', sans-serif"
                fontWeight="500"
            >
                Beta
            </text>
        </svg>
    );
}
