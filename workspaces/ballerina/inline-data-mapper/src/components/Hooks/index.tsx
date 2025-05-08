/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	DiagramModel,
    DiagramModelGenerics
} from "@projectstorm/react-diagrams";

import { DataMapperNodeModel } from '../Diagram/Node/commons/DataMapperNode';
import { getIONodeHeight } from '../Diagram/utils/diagram-utils';
import { OverlayLayerModel } from '../Diagram/OverlayLayer/OverlayLayerModel';
import { ErrorNodeKind } from '../DataMapper/Error/RenderingError';
import { useDMCollapsedFieldsStore, useDMExpandedFieldsStore, useDMSearchStore } from '../../store/store';
import { ArrayOutputNode, EmptyInputsNode, InputNode, ObjectOutputNode } from '../Diagram/Node';
import { GAP_BETWEEN_INPUT_NODES, OFFSETS } from '../Diagram/utils/constants';
import { InputDataImportNodeModel, OutputDataImportNodeModel } from '../Diagram/Node/DataImport/DataImportNode';
import { getErrorKind } from '../Diagram/utils/common-utils';

export const useRepositionedNodes = (
    nodes: DataMapperNodeModel[],
    zoomLevel: number,
    diagramModel: DiagramModel
) => {
    const nodesClone = [...nodes];
    const prevNodes = diagramModel.getNodes() as DataMapperNodeModel[];
    const filtersUnchanged = false;

    let prevBottomY = 0;

    nodesClone.forEach(node => {
        const exisitingNode = prevNodes.find(prevNode => prevNode.id === node.id);

        if (node instanceof ObjectOutputNode
            || node instanceof ArrayOutputNode
            || node instanceof OutputDataImportNodeModel
        ) {
            const x = OFFSETS.TARGET_NODE.X;
            const y = exisitingNode && exisitingNode.getY() !== 0 ? exisitingNode.getY() : 0;
            node.setPosition(x, y);
        }
        if (node instanceof InputNode
            || node instanceof EmptyInputsNode
            || node instanceof InputDataImportNodeModel
        ) {
            const x = OFFSETS.SOURCE_NODE.X;
            const computedY = prevBottomY + (prevBottomY ? GAP_BETWEEN_INPUT_NODES : 0);
            let y = exisitingNode && filtersUnchanged && exisitingNode.getY() !== 0 ? exisitingNode.getY() : computedY;
            node.setPosition(x, y);
            if (node instanceof InputNode) {
                const nodeHeight = getIONodeHeight(node.numberOfFields);
                prevBottomY = computedY + nodeHeight;
            }
        }
    });

    return nodesClone;
}

export const useDiagramModel = (
    nodes: DataMapperNodeModel[],
    diagramModel: DiagramModel,
    onError:(kind: ErrorNodeKind) => void,
    zoomLevel: number,
): {
    updatedModel: DiagramModel<DiagramModelGenerics>;
    isFetching: boolean;
    isError: boolean;
    refetch: any;
} => {
    const offSetX = diagramModel.getOffsetX();
    const offSetY = diagramModel.getOffsetY();
    const noOfNodes = nodes.length;
    const context = nodes.find(node => node.context)?.context;
    const { model } = context ?? {};
    const collapsedFields = useDMCollapsedFieldsStore(state => state.fields); // Subscribe to collapsedFields
    const expandedFields = useDMExpandedFieldsStore(state => state.fields); // Subscribe to expandedFields
    const { inputSearch, outputSearch } = useDMSearchStore();

    const genModel = async () => {
        if (diagramModel.getZoomLevel() !== zoomLevel && diagramModel.getNodes().length > 0) {
            // Update only zoom level and offset if zoom level is changed
            diagramModel.setZoomLevel(zoomLevel);
            diagramModel.setOffset(offSetX, offSetY);
            return diagramModel;
        }
        const newModel = new DiagramModel();
        newModel.setZoomLevel(zoomLevel);
        newModel.setOffset(offSetX, offSetY);
        newModel.addAll(...nodes);
        for (const node of nodes) {
            try {
                node.setModel(newModel);
                await node.initPorts();
                node.initLinks();
            } catch (e) {
                const errorNodeKind = getErrorKind(node);
                console.error(e);
                onError(errorNodeKind);
            }
        }
        newModel.setLocked(true);
        newModel.addLayer(new OverlayLayerModel());
        return newModel;
    };

    const {
        data: updatedModel,
        isFetching,
        isError,
        refetch,
    } = useQuery(
            ['genModel',
                {noOfNodes, model, inputSearch, outputSearch, collapsedFields, expandedFields, newZoomLevel: zoomLevel}
            ],
            () => genModel(),
            { networkMode: 'always' }
        );

    return { updatedModel, isFetching, isError, refetch };
};
