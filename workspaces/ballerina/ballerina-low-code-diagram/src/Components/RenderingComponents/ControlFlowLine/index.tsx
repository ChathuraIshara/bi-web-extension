/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js align  jsx-wrap-multiline
import React from "react";

import { ControlFlowLineState } from "../../../ViewState";

import { ControlFlowLineSVG } from "./ControlFlowLineSVG";
import "./style.scss";

export interface ControlFlowProps {
    controlFlowViewState?: ControlFlowLineState;
}

export function ControlFlowLine(props: ControlFlowProps) {
    const { controlFlowViewState } = props;
    const { h = 0, x, y, w = 0, isDotted } = controlFlowViewState;

    return (
        <g className="control-flow-line">
            <ControlFlowLineSVG
                x1={x}
                y1={y}
                x2={x + w}
                y2={y + h}
                isDotted={isDotted}
            />
        </g>
    );
}
