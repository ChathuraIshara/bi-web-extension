/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect } from "react";

import { DiagramEngine, NodeModel } from "@projectstorm/react-diagrams";

import { CustomCanvasWidget } from "./CustomCanvasWidget";

interface NavigationWrapperCanvasProps {
    diagramEngine: DiagramEngine;
    className?: string;
    focusedNode?: NodeModel;
    disableZoom?: boolean;
    disableMouseEvents?: boolean;
    overflow?: string;
    cursor?: string;
}

export function NavigationWrapperCanvasWidget(props: NavigationWrapperCanvasProps) {
    const { diagramEngine, focusedNode, className } = props;

    useEffect(() => {
        if (focusedNode) {
            setTimeout(() => {
                // eslint-disable-next-line no-use-before-define
                focusToNode(focusedNode, diagramEngine.getModel().getZoomLevel(), diagramEngine);
            }, 300);
        }
    }, [diagramEngine, focusedNode]);

    return (
        <CustomCanvasWidget
            engine={diagramEngine}
            isNodeFocused={!!focusedNode}
            className={className}
            disableZoom={props.disableZoom}
            disableMouseEvents={props.disableMouseEvents}
            overflow={props.overflow}
            cursor={props.cursor}
        />
    );
}

function focusToNode(node: NodeModel, currentZoomLevel: number, diagramEngine: DiagramEngine) {
    const canvasBounds = diagramEngine?.getCanvas()?.getBoundingClientRect();
    const nodeBounds = node?.getBoundingBox();

    if (canvasBounds && nodeBounds) {
        const zoomOffset = currentZoomLevel / 100;
        const offsetX = canvasBounds.width / 2 - (nodeBounds.getTopLeft().x + nodeBounds.getWidth() / 2) * zoomOffset;
        const offsetY = canvasBounds.height / 2 - (nodeBounds.getTopLeft().y + nodeBounds.getHeight() / 2) * zoomOffset;

        diagramEngine.getModel().setOffset(offsetX, offsetY);
        diagramEngine.repaintCanvas();
    }
}
