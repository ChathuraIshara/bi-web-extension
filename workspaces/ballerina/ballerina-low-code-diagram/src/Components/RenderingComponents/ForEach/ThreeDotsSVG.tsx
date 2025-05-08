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

export const COLLAPSE_DOTS_SVG_WIDTH = 18;
export const COLLAPSE_DOTS_SVG_HEIGHT = 4;

export function ThreeDotsSVG(props: { x: number, y: number }) {
    const { ...xyProps } = props;
    return (
        <svg {...xyProps} width={COLLAPSE_DOTS_SVG_WIDTH} height={COLLAPSE_DOTS_SVG_HEIGHT} >
            <g id="CollapseDots" transform="translate(0.5 0.5)">
                <path
                    id="Combined_Shape"
                    d="M14,1.5A1.5,1.5,0,1,1,15.5,3,1.5,1.5,0,0,1,14,1.5Zm-7,0A1.5,1.5,0,1,1,8.5,3,1.5,1.5,0,0,1,7,
                    1.5Zm-7,0A1.5,1.5,0,1,1,1.5,3,1.5,1.5,0,0,1,0,1.5Z"
                    fill="#f7f8fb"
                    stroke="#757785"
                    strokeMiterlimit="10"
                    strokeWidth="1"
                />
            </g>
        </svg>
    )
}
