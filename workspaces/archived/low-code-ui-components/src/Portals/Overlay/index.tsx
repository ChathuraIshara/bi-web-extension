/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";
import ReactDOM from "react-dom";

export interface DiagramOverlayPosition {
    x: number,
    y: number
}

export interface DiagramOverlayProps {
    position: DiagramOverlayPosition;
    children: React.ReactElement | React.ReactElement[],
    className?: string;
    stylePosition?: any
}

export function DiagramOverlay({ children, position, className, stylePosition }: DiagramOverlayProps) {
    return (
        <div
            className={className}
            style={{
                position: stylePosition ? stylePosition : 'relative',
                top: position.y,
                left: position.x,
                zIndex: 3
            }}
        >
            {children}
        </div>
    )
}

export interface DiagramOverlayContainerProps {
    children: React.ReactElement | React.ReactElement[];
    forceRender?: boolean;
    divId?: string;
}

export function DiagramOverlayContainer(props: DiagramOverlayContainerProps): any {
    const { children, forceRender, divId = `canvas-overlay` } = props;

    if (!forceRender) {
        return null;
    }

    const overlayDiv = document.getElementById(divId);

    if (overlayDiv) {
        // @ts-ignore
        return ReactDOM.createPortal(children, overlayDiv);
    } else {
        return null;
    }

}
