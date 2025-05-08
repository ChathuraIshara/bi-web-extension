/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DiagramModel } from "@projectstorm/react-diagrams-core";
import * as dagre from "dagre";
import { GraphLabel } from "dagre";
import _forEach from "lodash/forEach";

export interface DagreEngineOptions {
    graph?: GraphLabel;
    nodeMargin?: number;
}

export class DagreEngine {
    options: DagreEngineOptions;

    constructor(options: DagreEngineOptions = {}) {
        this.options = options;
    }

    redistribute(model: DiagramModel) {
        // Create a new directed graph
        var g = new dagre.graphlib.Graph({
            multigraph: true,
            compound: true,
        });
        g.setGraph(this.options.graph || {});
        g.setDefaultEdgeLabel(function () {
            return {};
        });

        // set nodes
        _forEach(model.getNodes(), (node) => {
            g.setNode(node.getID(), { width: node.width, height: node.height });
        });

        _forEach(model.getLinks(), (link) => {
            // set edges
            if (link.getSourcePort() && link.getTargetPort()) {
                g.setEdge({
                    v: link.getSourcePort().getNode().getID(),
                    w: link.getTargetPort().getNode().getID(),
                    name: link.getID(),
                });
            }
        });

        // layout the graph
        dagre.layout(g);

        g.nodes().forEach((v) => {
            const node = g.node(v);
            model.getNode(v).setPosition(node.x - node.width / 2, node.y - node.height / 2);
        });
    }
}
