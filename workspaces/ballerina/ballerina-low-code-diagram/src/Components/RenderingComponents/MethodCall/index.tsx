/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState } from "react";

import { filterComments } from "../../../Utils";

import "./style.scss";

export let METHODCALL_TEXT_WIDTH = 125;

export function MethodCall(props: { x: number, y: number, methodCall: string, key_id: number  }) {
    const { key_id, methodCall, ...xyProps } = props;
    const [textWidth, setTextWidth] = useState(METHODCALL_TEXT_WIDTH);

    useEffect(() => {
        setTextWidth(document.getElementById("textLegnth_" + key_id)?.getBoundingClientRect().width);
    }, []);

    const methodCallText = filterComments(methodCall);
    const methodCallMaxWidth = methodCallText?.length >= 16;

    return (
        <svg {...xyProps} width="150" height="24" className="method-call-wrapper">
            <g>
                <text
                    className={"method-name"}
                    transform="translate(4 13.5)"
                >
                    <tspan x="0" y="0">{methodCallMaxWidth ? methodCallText.slice(0, 16) + "..." : methodCallText}</tspan>
                </text>
            </g>
        </svg >
    );
}
