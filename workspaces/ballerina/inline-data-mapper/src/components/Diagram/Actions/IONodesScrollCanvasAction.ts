/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Action, ActionEvent, InputType } from "@projectstorm/react-canvas-core";
import { InputOutputPortModel } from "../Port";
import { DataMapperLinkModel } from "../Link";
import { DiagramEngine, NodeModel } from "@projectstorm/react-diagrams-core";
import {
    INPUT_NODE_DEFAULT_RIGHT_X,
    MIN_VISIBLE_HEIGHT,
    isInputNode,
    isOutputNode
} from "./utils";
import { IO_NODE_DEFAULT_WIDTH, VISUALIZER_PADDING, defaultModelOptions } from "../utils/constants";

export interface PanAndZoomCanvasActionOptions {
    inverseZoom?: boolean;
}

export class IONodesScrollCanvasAction extends Action {
    constructor(options: PanAndZoomCanvasActionOptions = {}) {
        super({
            type: InputType.MOUSE_WHEEL,
            fire: (actionEvent: ActionEvent<any>) => {
                const { event } = actionEvent;
                const { clientX, deltaY } = event;
                const zoomOffset = 100 / defaultModelOptions.zoom;

                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(false);
                }
                const model = this.engine.getModel();
                event.stopPropagation();

                const element = this.engine.getActionEventBus().getModelForEvent(actionEvent);

                let isInputScrollable = false;
                let isOutputScrollable = false;

                if (!element) {
                    // Scroll on empty space
                    const outputNodeDefaultLeftX =
                        ((window.innerWidth - VISUALIZER_PADDING) - IO_NODE_DEFAULT_WIDTH) * zoomOffset;
                    const scrolledX = clientX * zoomOffset;
                    if (scrolledX >= 0 && scrolledX <= INPUT_NODE_DEFAULT_RIGHT_X) {
                        isInputScrollable = true;
                    } else if (scrolledX >= outputNodeDefaultLeftX && scrolledX <= (window.innerWidth - VISUALIZER_PADDING) * zoomOffset) {
                        isOutputScrollable = true;
                    }
                } else {
                    isInputScrollable = isInputNode(element);
                    isOutputScrollable = isOutputNode(element);
                }

                let yDelta = options.inverseZoom ? - deltaY : deltaY;
                const diagramEngine = this.engine as DiagramEngine;
                const inputNodes = getInputNodes(diagramEngine);
                const ouputNode = getOutputNode(diagramEngine);

                if (isInputScrollable) {

                    const totalHeight = inputNodes.reduce((acc, node) => acc + node.height, 0);
                    const averageHeight = totalHeight / inputNodes.length;
                    let scrollStep = Math.min(Math.abs(yDelta), averageHeight / 2) * Math.sign(yDelta);
                
                    const firstNode = inputNodes[0];
                    const lastNode = inputNodes[inputNodes.length - 1];

                    if (firstNode) {
                        const newY = firstNode.getY() - scrollStep;
                        if (newY >= 0 && scrollStep < 0) {
                            // If the first node is at the top of the canvas, do not scroll further
                            scrollStep = firstNode.getY();
                        }
                    }

                    if (lastNode) {
                        const newY = lastNode.getY() - scrollStep;
                        const nodeBottomY = newY + lastNode.height;
                        if (nodeBottomY < MIN_VISIBLE_HEIGHT ) {
                            // If the last node is at the bottom of the canvas, do not scroll further
                            scrollStep = lastNode.getY() + lastNode.height - MIN_VISIBLE_HEIGHT;
                        }
                    }

                    inputNodes.forEach(element => {
                        element.setPosition(element.getX(), element.getY() - scrollStep);
                    });

                } else if (isOutputScrollable) {

                    if (ouputNode) {
                        let scrollStep = Math.min(Math.abs(yDelta), ouputNode.height / 2) * Math.sign(yDelta);
                        let newY = ouputNode.getY() - scrollStep;
                        const nodeBottomY = newY + ouputNode.height;
                        if (newY >= 0 && scrollStep < 0) {
                            // If the output node is at the top of the canvas, do not scroll further
                            scrollStep = ouputNode.getY();
                        }
                        if (nodeBottomY < MIN_VISIBLE_HEIGHT) {
                            // If the output node is at the bottom of the canvas, do not scroll further
                            scrollStep = ouputNode.getY() + ouputNode.height - MIN_VISIBLE_HEIGHT;
                        }
                        ouputNode.setPosition(ouputNode.getX(), ouputNode.getY() - scrollStep);
                    }
                    ouputNode && repositionIntermediateNodes(ouputNode);

                } else if (!element) {
                    yDelta = getYDeltaForGlobalScroll(diagramEngine, yDelta, zoomOffset);
					const offsetY = Math.min(0, model.getOffsetY() - yDelta);
                    model.setOffset(model.getOffsetX(), offsetY);
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

function getInputNodes(diagramEngine: DiagramEngine) {
    return diagramEngine.getModel().getNodes().filter(node => isInputNode(node));
}

function getOutputNode(diagramEngine: DiagramEngine) {
    return diagramEngine.getModel().getNodes().filter(node => isOutputNode(node))[0];
}

function repositionIntermediateNodes(outputNode: NodeModel) {
    const ports = outputNode.getPorts();
    for (const port of Object.values(ports)) {
        if (port instanceof InputOutputPortModel) {
            // Output port can only have one link, hence the first link is considered
            const link = Object.values(port.getLinks())[0];
            if (link instanceof DataMapperLinkModel) {
                const sourceNode = link.getSourcePort().getNode();
                const targetPortPosition = link.getTargetPort().getPosition();
                // if (sourceNode instanceof LinkConnectorNode || sourceNode instanceof ArrayFnConnectorNode) {
                //     sourceNode.setPosition(sourceNode.getX(), targetPortPosition.y - 4.5);
                // }
            }
        }
    }
}


function getYDeltaForGlobalScroll(diagramEngine: DiagramEngine, yDelta: number, zoomOffset: number) {
    let newYDelta = yDelta;
    const model = diagramEngine.getModel();
    const offsetY = model.getOffsetY() * zoomOffset;

    const lastInputNode = getInputNodes(diagramEngine).pop();
    const outputNode = getOutputNode(diagramEngine);

    if (!lastInputNode || !outputNode) return; // When data import nodes present

    const nodeWithMaxBottomY = [lastInputNode, outputNode].reduce((prevNode, currentNode) => {
        return prevNode.getBoundingBox().getBottomLeft().y > currentNode.getBoundingBox().getBottomLeft().y
            ? prevNode
            : currentNode;
    });

    const nodeOffsetY = nodeWithMaxBottomY.getY() < 0 ? nodeWithMaxBottomY.getY() : 0;
    let newY = offsetY - yDelta;
    const visibleHeight = newY + nodeWithMaxBottomY.height + nodeOffsetY;

    if (visibleHeight < MIN_VISIBLE_HEIGHT ) {
        // If the tallest node is at the bottom of the canvas, do not scroll further
        newYDelta = offsetY + nodeWithMaxBottomY.height - MIN_VISIBLE_HEIGHT + nodeOffsetY;
    }

    return newYDelta;
}
