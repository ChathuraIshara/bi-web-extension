/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { useDMArrayFilterStore } from "../../../store/store";
import { ArrayFilterNode } from "../Node";
import { DataMapperNodeModel } from "../Node/commons/DataMapperNode";
import {
    ADD_ARRAY_FILTER_BUTTON_HEIGHT,
    ARRAY_FILTER_NODE_ELEMENT_HEIGHT,
    ARRAY_FILTER_NODE_HEADER_HEIGHT,
    ARRAY_FILTER_SEPARATOR_HEIGHT,
    GAP_BETWEEN_FIELDS,
    GAP_BETWEEN_NODE_HEADER_AND_BODY,
    IO_NODE_FIELD_HEIGHT,
    IO_NODE_HEADER_HEIGHT,
    defaultModelOptions
} from "./constants";

export function calculateZoomLevel(screenWidth: number) {
    const minWidth = 200;
    const maxWidth = 850; // After this width, the max zoom level is reached
    const minZoom = 20;
    const maxZoom = defaultModelOptions.zoom;

	// Ensure the max zoom level is not exceeded
	const boundedScreenWidth = Math.min(screenWidth, maxWidth);
    const normalizedWidth = (boundedScreenWidth - minWidth) / (maxWidth - minWidth);
    const zoomLevel = minZoom + normalizedWidth * (maxZoom - minZoom);
    return Math.max(minZoom, Math.min(maxZoom, zoomLevel));
}

export function getIONodeHeight(noOfFields: number) {
	return noOfFields * IO_NODE_FIELD_HEIGHT
		+ (IO_NODE_HEADER_HEIGHT - IO_NODE_FIELD_HEIGHT)
		+ noOfFields * GAP_BETWEEN_FIELDS
		+ GAP_BETWEEN_NODE_HEADER_AND_BODY;
}

export function getArrayFilterNodeHeight(arrayFilterNode: ArrayFilterNode) {
    const { noOfFilters } = arrayFilterNode;
    const { isCollapsed }  = useDMArrayFilterStore.getState();

    const collapsedHeight = ARRAY_FILTER_NODE_HEADER_HEIGHT
        + ADD_ARRAY_FILTER_BUTTON_HEIGHT
        + ARRAY_FILTER_SEPARATOR_HEIGHT;
	const expandedHeight =  collapsedHeight
        + noOfFilters * ARRAY_FILTER_NODE_ELEMENT_HEIGHT
		+ noOfFilters * GAP_BETWEEN_FIELDS
		+ ARRAY_FILTER_SEPARATOR_HEIGHT;

    return isCollapsed ? collapsedHeight : expandedHeight;
}

export function calculateControlPointOffset(screenWidth: number) {
    const minWidth = 850;
    const maxWidth = 1500;
    const minOffset = 25;
    const maxOffset = 320;

    const clampedWidth = Math.min(Math.max(screenWidth, minWidth), maxWidth);
    const interpolationFactor = (clampedWidth - minWidth) / (maxWidth - minWidth);
    const interpolatedOffset = minOffset + interpolationFactor * (maxOffset - minOffset);
    return interpolatedOffset;
}

export function isSameView(newNode: DataMapperNodeModel, existingNode?: DataMapperNodeModel) {
    if (!existingNode || !existingNode?.context || !newNode?.context) return;

    const prevFocusedView = existingNode.context.views[existingNode.context.views.length - 1];
    const newFocusedView = newNode.context.views[newNode.context.views.length - 1];

    return prevFocusedView.label === newFocusedView.label;
}

export function hasSameFilters(newNodes: DataMapperNodeModel[], existingNodes?: DataMapperNodeModel[]) {
    if (!existingNodes) return;

    const newArrayFilterNode = newNodes.find(node => node instanceof ArrayFilterNode) as ArrayFilterNode;
    const existingArrayFilterNode = existingNodes.find(node => node instanceof ArrayFilterNode) as ArrayFilterNode;

    if (!newArrayFilterNode && !existingArrayFilterNode) return true;

    if (newArrayFilterNode && existingArrayFilterNode) {
        return newArrayFilterNode.noOfFilters === existingArrayFilterNode.noOfFilters;
    }

    return true;
}
