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

export const PLUSCIRCLE_SVG_WIDTH_WITH_SHADOW = 13;
export const PLUSCIRCLE_SVG_HEIGHT_WITH_SHADOW = 13;
export const PLUSCIRCLE_SVG_WIDTH = 11;
export const PLUSCIRCLE_SVG_HEIGHT = 11;

export function PlusCircleSVG(props: { x: number, y: number, selected: boolean }) {
    const { selected, ...xyProps } = props;
    return (
        <svg {...xyProps} width={PLUSCIRCLE_SVG_WIDTH_WITH_SHADOW} height={PLUSCIRCLE_SVG_HEIGHT_WITH_SHADOW}>
            <g id="PlusCircle" transform="translate(1 1)" fill={selected ? "#5567d5" : "#ffffff"} stroke="#a6b3ff" strokeMiterlimit="10" strokeWidth="1">
                <circle cx="5.5" cy="5.5" r="5.5" stroke="none" />
                <circle cx="5.5" cy="5.5" r="6" fill="none" />
            </g>
            <path
                id="PlusCircleAddIcon"
                d="M2,4.5V3H.5a.5.5,0,1,1,0-1H2V.5a.5.5,0,1,1,1,0V2H4.5a.5.5,0,1,1,0,1H3V4.5a.5.5,0,1,1-1,0Z"
                transform="translate(4 4)"
                fill={selected ? "#ffffff" : "#5567d5"}
            />
        </svg>
    )
}
