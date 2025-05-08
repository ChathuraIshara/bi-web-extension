/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

import { ArrowHead } from "../../ArrowHead";

export interface ActionInvoLineProps {
    clientInvoX: number,
    clientInvoY: number,
    actionX: number,
    actionY: number,
    direction: "left" | "right",
    className: string
}

export function ActionInvoLineC(props: ActionInvoLineProps) {
    const { clientInvoX, clientInvoY, actionX, actionY, direction, className } = props;

    return (
        <g>
            <line x1={clientInvoX} y1={clientInvoY} x2={actionX} y2={actionY} className={className}/>
            <ArrowHead x={actionX} y={actionY} direction={direction} />
        </g>
    );
}

export const ActionInvoLine = ActionInvoLineC;
