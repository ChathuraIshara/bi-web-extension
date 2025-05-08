/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import './style.scss';

export interface CanvasProps {
    children?: React.ReactElement | React.ReactElement[],
    w: number,
    h: number
}

export function Canvas(props: CanvasProps) {
    const { children, w, h } = props;

    return (
        <div className="diagram-canvas-wrap">
            <svg
                data-testid="diagram-canvas"
                className="diagram-canvas"
                preserveAspectRatio={"xMinYMin"}
                width={w}
                height={'calc(100vh - 98px)'}
                style={{overflow: 'visible'}}
            >
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="0"
                        refY="3.5"
                        orient="auto"
                        fill="#5567d5"
                    >
                        <polygon points="0 0, 7 3.5, 0 7" />
                    </marker>
                </defs>
                <g>
                    {children}
                </g>
                <g className="diagram-overlay" />
            </svg >
        </div>
    );
};

