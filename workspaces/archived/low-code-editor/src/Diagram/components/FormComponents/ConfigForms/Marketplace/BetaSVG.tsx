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

export function BetaSVG() {
    return (
        <svg width={BETA_SVG_WIDTH} height={BETA_SVG_HEIGHT} >
            <rect id="Rectangle" className="beta-button" width="26" height="12" rx="4"/>
            <text id="Beta" className="beta-text" transform="translate(3.75 8.5)">
                <tspan x="0" y="0">Beta</tspan>
            </text>
        </svg>
    )
}
