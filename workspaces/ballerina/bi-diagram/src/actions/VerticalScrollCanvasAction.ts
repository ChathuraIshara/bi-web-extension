/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Action, ActionEvent, InputType } from "@projectstorm/react-canvas-core";

export interface PanAndZoomCanvasActionOptions {
    inverseZoom?: boolean;
}

export class VerticalScrollCanvasAction extends Action {
    constructor(options: PanAndZoomCanvasActionOptions = {}) {
        super({
            type: InputType.MOUSE_WHEEL,
            fire: (actionEvent: ActionEvent<any>) => {
                const { event } = actionEvent;
                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(false);
                }

                const model = this.engine.getModel();
                event.stopPropagation();
                if (event.ctrlKey) {
                    // Pinch and zoom gesture
                    const oldZoomFactor = this.engine.getModel().getZoomLevel() / 100;

                    let scrollDelta = options.inverseZoom ? event.deltaY : -event.deltaY;
                    scrollDelta /= 3;

                    if (model.getZoomLevel() + scrollDelta > 10) {
                        model.setZoomLevel(model.getZoomLevel() + scrollDelta);
                    }

                    const zoomFactor = model.getZoomLevel() / 100;

                    const boundingRect = event.currentTarget.getBoundingClientRect();
                    const clientWidth = boundingRect.width;
                    const clientHeight = boundingRect.height;
                    // compute difference between rect before and after scroll
                    const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
                    const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
                    // compute mouse coords relative to canvas
                    const clientX = event.clientX - boundingRect.left;
                    const clientY = event.clientY - boundingRect.top;

                    // compute width and height increment factor
                    const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
                    const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;

                    model.setOffset(
                        model.getOffsetX() - widthDiff * xFactor,
                        model.getOffsetY() - heightDiff * yFactor
                    );
                } else {
                    // vertical scroll
                    const xDelta = Math.abs(event.deltaX);
                    const yDelta = Math.abs(event.deltaY);

                    if (yDelta < xDelta && xDelta > 8) {
                        const horizontalDelta = options.inverseZoom ? -event.deltaX : event.deltaX;
                        const offsetX = model.getOffsetX() - horizontalDelta;
                        model.setOffset(offsetX, model.getOffsetY());
                    } else {
                        const verticalDelta = options.inverseZoom ? -event.deltaY : event.deltaY;
                        const offsetY = model.getOffsetY() - verticalDelta;
                        model.setOffset(model.getOffsetX(), offsetY);
                    }
                }
                this.engine.repaintCanvas();

                // re-enable rendering
                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(true);
                }
            },
        });
    }
}
