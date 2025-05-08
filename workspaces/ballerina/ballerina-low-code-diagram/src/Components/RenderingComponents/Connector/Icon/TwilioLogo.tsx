/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

export const TWILIO_LOGO_WIDTH = 20;
export const TWILIO_LOGO_HEIGHT = 20;

export function TwilioLogo(props: { cx?: number, cy?: number, scale?: number }) {
    const { cx, cy, scale } = props;
    return (
        <svg transform={scale ? `scale(${scale})` : ''} x={!cx ? 0 : cx - (TWILIO_LOGO_WIDTH / 2)} y={!cy ? 0 : cy - (TWILIO_LOGO_HEIGHT / 2)} width={TWILIO_LOGO_WIDTH} height={TWILIO_LOGO_HEIGHT} >
            <g id="Logo_Twilio" transform="translate(-12 -12)">
                <path id="Path_215" d="M22,29.364A7.364,7.364,0,1,1,29.364,22,7.365,7.365,0,0,1,22,29.364ZM22,12A10,10,0,1,0,32,22,10,10,0,0,0,22,12Z" fill="#cf272d" />
                <path id="Path_216" d="M22.411,19.507a2.076,2.076,0,1,1,2.077,2.077,2.075,2.075,0,0,1-2.077-2.077" fill="#cf272d" />
                <path id="Path_217" d="M22.411,24.493a2.076,2.076,0,1,1,2.077,2.077,2.075,2.075,0,0,1-2.077-2.077" fill="#cf272d" />
                <path id="Path_218" d="M17.43,24.493a2.077,2.077,0,1,1,2.077,2.077,2.076,2.076,0,0,1-2.077-2.077" fill="#cf272d" />
                <path id="Path_219" d="M17.43,19.507a2.077,2.077,0,1,1,2.077,2.077,2.076,2.076,0,0,1-2.077-2.077" fill="#cf272d" />
            </g>
        </svg>
    )
}

