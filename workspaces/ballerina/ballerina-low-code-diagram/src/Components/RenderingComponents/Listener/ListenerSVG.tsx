/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js  jsx-wrap-multiline
import React from "react"

import "./style.scss";

export const LISTENER_HEIGHT: number = 49;
export const LISTENER_WIDTH: number = 452;

export const LISTENER_TYPE_WIDTH: number = 80;
export const LISTENER_TYPE_HEIGHT: number = 32;
export const LISTENER_TYPE_PADDING_TOP: number = 8.5;
export const LISTENER_TYPE_PADDING_LEFT: number = 8.5;

export const LISTENER_TYPE_TEXT_PADDING_TOP: number = 20;
export const LISTENER_TYPE_TEXT_PADDING_LEFT: number = 15;

export const LISTENER_NAME_TEXT_PADDING_TOP: number = 20;
export const LISTENER_NAME_TEXT_PADDING_LEFT: number = 15;

export interface ModuleVariableSVGProps {
    x: number;
    y: number;
    h: number;
    w: number;
    type: string;
    name: string;
    port: string;
}

export function ListenerSVG(props: ModuleVariableSVGProps) {
    const { x, y, h, w, type, name, port } = props;

    const rectProps = { x, y, width: w, height: h };

    const typeRectProps = { x: (x + LISTENER_TYPE_PADDING_LEFT), y: (y + LISTENER_TYPE_PADDING_TOP),
                            width: LISTENER_TYPE_WIDTH, height: LISTENER_TYPE_HEIGHT };

    const typeTextProps = { x: (typeRectProps.x + LISTENER_TYPE_TEXT_PADDING_LEFT),
                            y: (typeRectProps.y + LISTENER_TYPE_TEXT_PADDING_TOP) };

    const nameTextProps = { x: (typeRectProps.x + typeRectProps.width + LISTENER_NAME_TEXT_PADDING_LEFT),
                            y: (typeRectProps.y + LISTENER_NAME_TEXT_PADDING_TOP) };

    const separatorTextXPosition = nameTextProps.x + ((name.length + 3) * 7);
    const textSeparatorProps = { x: separatorTextXPosition, y: nameTextProps.y };

    const valueTextXPosition = textSeparatorProps.x + 21;
    const valueTextProps = { x: valueTextXPosition, y: nameTextProps.y };

    return (
        <g>
            <rect className={"listener-rect"} {...rectProps} />
            <rect className={"listener-type-rect"} {...typeRectProps} />
            <text className={"listener-type-text"} {...typeTextProps} >
                {type}
            </text>
            <text className={"listener-attribute-text"} {...nameTextProps} >
                {name}
            </text>
            { port && (
                <g>
                    <text className={"listener-attribute-text"} {...textSeparatorProps} >
                        {"|"}
                    </text>
                    <text className={"listener-attribute-text"} {...valueTextProps} >
                        {port}
                    </text>
                </g>
            )}
        </g>
    );
}
