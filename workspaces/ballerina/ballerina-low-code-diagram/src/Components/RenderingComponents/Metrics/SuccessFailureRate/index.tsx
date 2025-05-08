/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

import "../style.scss"

import { ErrorSVG } from "./ErrorSVG";
import { SuccessSVG } from "./SuccessSVG";

export interface SuccessTextProps {
    x: number,
    y: number,
    successRate: number,
    failureRate: number
}

export function SuccessFailureC(props: SuccessTextProps) {
    const { x, y, successRate, failureRate } = props;
    if (failureRate > successRate){
        return (
            <g>
                <ErrorSVG x={x} y={y} failureRate={failureRate}/>
            </g>
        );
    }else{
        return (
            <g>
                <SuccessSVG x={x} y={y} successRate={successRate} />
            </g>
        );
    }
}

export const SuccesFailure = SuccessFailureC;
