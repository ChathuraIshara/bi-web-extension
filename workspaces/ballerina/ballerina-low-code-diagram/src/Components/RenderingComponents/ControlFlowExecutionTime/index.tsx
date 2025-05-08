/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react'

import { ArrowHead } from '../ArrowHead'
import { CounterRightSVG, COUNTERRIGHT_SVG_HEIGHT, COUNTERRIGHT_SVG_WIDTH } from '../Metrics/ResponseTImer/CounterRightSVG';

import "./style.scss"

export const EXECUTION_TIME_IF_X_OFFSET = 170;
export const EXECUTION_TIME_DEFAULT_X_OFFSET = 20;

interface ControlFlowExecutionTimeProps {
    x: number,
    y: number,
    h: number,
    value: number;
}

const units = ['ns', 'μs', 'ms', 's'];
const formatDuration = (timeRange: number) => {
    const sizeFactor = Math.floor(timeRange).toString().length - 1;
    const unitIndex = sizeFactor > 9 ? 3 : Math.floor(sizeFactor / 3);
    const unit = units[unitIndex];
    const timeDuration = (timeRange / Math.pow(10, (unitIndex) * 3));
    const formatedDuration = timeDuration > 10 ? timeDuration.toFixed(0) : timeDuration.toFixed(1);

    return [formatedDuration, unit];
}

export default function ControlFlowExecutionTime(props: ControlFlowExecutionTimeProps) {
    const { x, y, h, value } = props;
    const [time, unit] = formatDuration(value);
    const text = `${time} ${unit}`

    return (
        <g className="control-flow-execution">
            <ArrowHead x={x} y={y} direction="up" />
            <ArrowHead x={x} y={y + h} direction="down" />
            <line className="line" x1={x} y1={y} x2={x} y2={y + h} />
            <CounterRightSVG x={x - COUNTERRIGHT_SVG_WIDTH} y={y + (h / 2) - (COUNTERRIGHT_SVG_HEIGHT / 2)} text={text} />
        </g>
    );
}
