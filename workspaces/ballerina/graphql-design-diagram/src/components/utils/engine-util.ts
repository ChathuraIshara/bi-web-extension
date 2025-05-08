/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import createEngine, { DiagramEngine, NodeModel } from "@projectstorm/react-diagrams";

import { GraphqlDefaultLinkFactory } from "../Link/DefaultLink/GraphqlDefaultLinkFactory";
import { GraphqlServiceLinkFactory } from "../Link/GraphqlServiceLink/GraphqlServiceLinkFactory";
import { EnumNodeFactory } from "../Nodes/EnumNode/EnumNodeFactory";
import { GraphqlServiceNodeFactory } from "../Nodes/GraphqlServiceNode/GraphqlServiceNodeFactory";
import { HierarchicalNodeFactory } from "../Nodes/HierarchicalResourceNode/HierarchicalNodeFactory";
import { InterfaceNodeFactory } from "../Nodes/InterfaceNode/InterfaceNodeFactory";
import { RecordNodeFactory } from "../Nodes/RecordNode/RecordNodeFactory";
import { ServiceClassNodeFactory } from "../Nodes/ServiceClassNode/ServiceClassNodeFactory";
import { UnionNodeFactory } from "../Nodes/UnionNode/UnionNodeFactory";
import { GraphqlOverlayLayerFactory } from "../OverlayLoader";
import { GraphqlBasePortFactory } from "../Port/GraphqlBasePortFactory";

export function createGraphqlDiagramEngine(): DiagramEngine {
    const diagramEngine: DiagramEngine = createEngine({
        registerDefaultPanAndZoomCanvasAction: true,
        registerDefaultZoomCanvasAction: false
    });
    diagramEngine.getLinkFactories().registerFactory(new GraphqlServiceLinkFactory());
    diagramEngine.getPortFactories().registerFactory(new GraphqlBasePortFactory());
    diagramEngine.getNodeFactories().registerFactory(new GraphqlServiceNodeFactory());
    diagramEngine.getLinkFactories().registerFactory(new GraphqlDefaultLinkFactory());

    diagramEngine.getNodeFactories().registerFactory(new EnumNodeFactory());
    diagramEngine.getNodeFactories().registerFactory(new RecordNodeFactory());
    diagramEngine.getNodeFactories().registerFactory(new ServiceClassNodeFactory());
    diagramEngine.getNodeFactories().registerFactory(new UnionNodeFactory());
    diagramEngine.getNodeFactories().registerFactory(new InterfaceNodeFactory());
    diagramEngine.getNodeFactories().registerFactory(new HierarchicalNodeFactory());
    diagramEngine.getLayerFactories().registerFactory(new GraphqlOverlayLayerFactory());
    return diagramEngine;
}

export function focusToNode(node: NodeModel, currentZoomLevel: number, diagramEngine: DiagramEngine) {
    const canvasBounds = diagramEngine.getCanvas().getBoundingClientRect();
    const nodeBounds = node.getBoundingBox();

    const zoomOffset = currentZoomLevel / 100;
    const offsetX = canvasBounds.width / 2 - (nodeBounds.getTopLeft().x + nodeBounds.getWidth() / 2) * zoomOffset;
    const offsetY = canvasBounds.height / 2 - (nodeBounds.getTopLeft().y + nodeBounds.getHeight() / 2) * zoomOffset;

    diagramEngine.getModel().setOffset(offsetX, offsetY);
    diagramEngine.repaintCanvas();
}
