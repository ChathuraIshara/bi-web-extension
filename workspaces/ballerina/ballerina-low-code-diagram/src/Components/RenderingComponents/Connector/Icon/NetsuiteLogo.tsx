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

export const NETSUITE_LOGO_WIDTH = 20;
export const NETSUITE_LOGO_HEIGHT = 20;

export function NetsuiteLogo(props: { cx?: number, cy?: number, scale?: number }) {
    const { cx, cy, scale } = props;
    return (
        <svg transform={scale ? `scale(${scale})` : ''} x={!cx ? 0 : cx - (NETSUITE_LOGO_WIDTH / 2)} y={!cy ? 0 : cy - (NETSUITE_LOGO_HEIGHT / 2)} width={NETSUITE_LOGO_WIDTH} height={NETSUITE_LOGO_HEIGHT} >
            <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Netsuite" transform="translate(-11.545 -11.043)">
                    <path id="Path" d="M16.4,16.5v9.784h1.962v3.852H12.455V16.5Z" fill="#b9c7d4" fillRule="evenodd" />
                    <path id="Path-2" d="M11.558,11.043H24.727V22.407L19.59,15.855H11.545C11.558,14.294,11.558,11.121,11.558,11.043Z" fill="#00467f" fillRule="evenodd" />
                    <path id="Path-3" d="M19.273,20.134c1.723,2.058,3.369,4.189,5.067,6.259h8.115v4.65H19.273Z" fill="#00467f" fillRule="evenodd" />
                    <path id="Path-4" d="M25.182,15.728V11.953h5.909V25.589H27.168V15.728Z" fill="#b9c7d4" fillRule="evenodd" />
                </g>
            </g>
        </svg>
    )
}

