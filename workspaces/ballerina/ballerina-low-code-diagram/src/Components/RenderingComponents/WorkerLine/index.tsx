/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

import cn from "classnames";

import { FunctionViewState, ViewState } from "../../../ViewState";

import "./style.scss";

export interface WorkerLineProps {
    viewState: ViewState
}

export function WorkerLine(props: WorkerLineProps) {
    const { viewState } = props;
    const functionViewState: FunctionViewState = viewState as FunctionViewState;
    const x = functionViewState.workerLine.x;
    const y = functionViewState.workerLine.y;
    const h = functionViewState.workerLine.h;
    const classes = cn("worker-line");
    return (
        <g className={classes}>
            <line x1={x} y1={y} x2={x} y2={y + h} />
        </g>
    );
}
