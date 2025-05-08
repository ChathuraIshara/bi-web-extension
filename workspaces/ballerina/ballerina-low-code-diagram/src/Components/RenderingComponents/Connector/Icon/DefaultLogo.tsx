/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

export const DEFAULT_LOGO_WIDTH = 47;
export const DEFAULT_LOGO_HEIGHT = 47;

export function DefaultLogo(props: { cx?: number, cy?: number, scale?: number }) {
    const { cx, cy, scale } = props;
    return (
        <svg transform={scale ? `scale(${scale})` : ''} x={!cx ? 0 : cx - (DEFAULT_LOGO_WIDTH / 2)} y={!cy ? 0 : cy - (DEFAULT_LOGO_HEIGHT / 2)} width={DEFAULT_LOGO_WIDTH} height={DEFAULT_LOGO_HEIGHT} >
            <circle id="DefaultIcon" cx="23.5" cy="23.5" r="23.5" fill="#e6e7ec"/>
        </svg>
    )
}
