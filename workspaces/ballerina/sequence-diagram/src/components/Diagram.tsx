/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";
import { DiagramEngine, DiagramModel } from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { generateEngine, getEntryParticipant, registerListeners } from "../utils/diagram";
import { DiagramCanvas } from "./DiagramCanvas";
import { traverseParticipant } from "../utils/traverse-utils";
import { ElementFactoryVisitor } from "../visitors/ElementFactoryVisitor";
import { OverlayLayerModel } from "./OverlayLayer";
import { DiagramContextProvider, DiagramContextState } from "./DiagramContext";
import { Flow, NodeModel } from "../utils/types";
import { PositionVisitor } from "../visitors/PositionVisitor";
import { NodeLinkModel } from "./NodeLink";
import { InitVisitor } from "../visitors/InitVisitor";
import { ConsoleColor, logger } from "../utils/logger";
import { NodeTypes } from "../resources/constants";
import { SqParticipant, SqParticipantType } from "@wso2-enterprise/ballerina-core";
import { Controls } from "./Controls";

export interface DiagramProps {
    model: Flow;
    onClickParticipant: (participant: SqParticipant) => void;
    onAddParticipant: (kind: SqParticipantType) => void;
    onReady: () => void;
}

export function Diagram(props: DiagramProps) {
    const { model: flow, onClickParticipant, onAddParticipant, onReady } = props;
    const [diagramEngine] = useState<DiagramEngine>(generateEngine());
    const [diagramModel, setDiagramModel] = useState<DiagramModel | null>(null);
    logger("diagram: flow model", ConsoleColor.AUTO, flow);
    useEffect(() => {
        if (diagramEngine) {
            const { nodes, links } = getDiagramData();
            drawDiagram(nodes, links);
        }
    }, [flow]);

    const getDiagramData = () => {
        if (!flow || !flow.participants || flow.participants.length === 0) {
            return { nodes: [], links: [] };
        }
        // get entry participant
        const entryParticipant = getEntryParticipant(flow);
        if (!entryParticipant) {
            console.error("Entry participant not found");
            return { nodes: [], links: [] };
        }

        // skip others
        flow.others = []; // TODO: remove this from API

        // flow.others change id numbers to be unique
        flow.others = flow.others?.map((participant, index) => ({
            ...participant,
            id: "other-participant-" + (index + 1).toString(),
        }));

        const initVisitor = new InitVisitor(flow);
        traverseParticipant(entryParticipant, initVisitor, flow);
        const positionVisitor = new PositionVisitor(flow);
        traverseParticipant(entryParticipant, positionVisitor, flow);
        const elementVisitor = new ElementFactoryVisitor(flow);
        traverseParticipant(entryParticipant, elementVisitor, flow);

        const allNodes = elementVisitor.getNodes();
        const links = elementVisitor.getLinks();
        logger("diagram: enriched flow model", ConsoleColor.AUTO, {
            enrichedFlow: flow,
            diagramModels: { allNodes, links },
        });

        // arrange nodes
        const participants = allNodes.filter((node) => node.getType() === NodeTypes.PARTICIPANT_NODE);
        const interactions = allNodes.filter((node) => node.getType() !== NodeTypes.PARTICIPANT_NODE);
        const nodes = [...participants, ...interactions];

        return { nodes, links } as {
            nodes: NodeModel[];
            links: NodeLinkModel[];
        };
    };

    const drawDiagram = (nodes: NodeModel[], links: NodeLinkModel[]) => {
        const newDiagramModel = new DiagramModel();
        newDiagramModel.addLayer(new OverlayLayerModel());
        newDiagramModel.addAll(...nodes, ...links);
        logger("diagram: diagram model", ConsoleColor.AUTO, newDiagramModel);
        diagramEngine.setModel(newDiagramModel);
        setDiagramModel(newDiagramModel);
        registerListeners(diagramEngine);

        setTimeout(() => {
            diagramEngine.setModel(newDiagramModel);
            // remove loader overlay layer
            const overlayLayer = diagramEngine
                .getModel()
                .getLayers()
                .find((layer) => layer instanceof OverlayLayerModel);
            if (overlayLayer) {
                diagramEngine.getModel().removeLayer(overlayLayer);
            }
            // change canvas position to first node
            diagramEngine.zoomToFitNodes({
                maxZoom: 1,
            });
            // Set zoom level to 100%
            diagramEngine.getModel().setZoomLevel(100);
            diagramEngine.repaintCanvas();
            // update the diagram model state
            setDiagramModel(newDiagramModel);
            onReady();
        }, 1000);
    };

    const context: DiagramContextState = {
        flow: flow,
        onClickParticipant: onClickParticipant,
        onAddParticipant: onAddParticipant,
    };

    return (
        <>
            <Controls engine={diagramEngine} />
            {diagramEngine && diagramModel && (
                <DiagramContextProvider value={context}>
                    <DiagramCanvas>
                        <CanvasWidget engine={diagramEngine} />
                    </DiagramCanvas>
                </DiagramContextProvider>
            )}
        </>
    );
}
