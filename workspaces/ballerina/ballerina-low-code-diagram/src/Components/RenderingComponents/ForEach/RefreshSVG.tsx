/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
export const REFRESH_SVG_WIDTH = 25;
export const REFRESH_SVG_HEIGHT = 25;

import * as React from "react";

export function RefreshSVG(props: { x: number, y: number }) {
    const { ...xyProps } = props;
    return (
        <svg {...xyProps} width={REFRESH_SVG_WIDTH} height={REFRESH_SVG_HEIGHT}>
            <defs>
                <clipPath id="RefreshClipPath">
                    <path
                        id="RefreshCombinedShapeA"
                        d="M6.992,16.79,5.245,15.043a.5.5,0,0,1-.5-.607.5.5,0,0,1,
                        .5-.608l1.747-1.745a.5.5,0,1,1,.707.707L6.052,14.436l.448.448V14a5.5,5.5,0,0,0,
                        4.193-9.059l-.185-.207.729-.685a6.5,6.5,0,0,1-4.5,10.948l-.121,0L7.7,16.083a.5.5,0,0,
                        1-.707.707ZM2.122,13.3h0A6.5,6.5,0,0,1,6.5,2L5.354.853A.5.5,0,0,1,6.061.147L7.807,
                        1.892a.5.5,0,0,1,.5.608.5.5,0,0,1-.5.608L6.061,4.854a.5.5,0,0,1-.707-.707L7,2.5,6.5,2V3a5.5,
                        5.5,0,0,0-3.9,9.379l.2.187-.672.739Z"
                        transform="translate(2 11.192) rotate(-45)"
                        fill="#777987"
                    />
                </clipPath>
            </defs>
            <g id="Refresh">
                <path
                    id="RefreshCombinedShapeB"
                    d="M6.992,16.79,5.245,15.043a.5.5,0,0,1-.5-.607.5.5,0,0,1,.5-.608l1.747-1.745a.5.5,0,1,1,
                    .707.707L6.052,14.436l.448.448V14a5.5,5.5,0,0,0,4.193-9.059l-.185-.207.729-.685a6.5,6.5,0,0,
                    1-4.5,10.948l-.121,0L7.7,16.083a.5.5,0,0,1-.707.707ZM2.122,13.3h0A6.5,6.5,0,0,1,6.5,
                    2L5.354.853A.5.5,0,0,1,6.061.147L7.807,1.892a.5.5,0,0,1,.5.608.5.5,0,0,1-.5.608L6.061,4.854a.5.5,
                    0,0,1-.707-.707L7,2.5,6.5,2V3a5.5,5.5,0,0,0-3.9,9.379l.2.187-.672.739Z"
                    transform="translate(2 11.192) rotate(-45)"
                    fill="#777987"
                />
                <g id="RefreshMask" clipPath="url(#RefreshClipPath)">
                    <rect id="RefreshRect" width="25" height="25" fill="#8d91a3" />
                </g>
            </g>
        </svg>
    )
}
