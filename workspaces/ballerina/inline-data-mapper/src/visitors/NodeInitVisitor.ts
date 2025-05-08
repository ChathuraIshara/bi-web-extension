/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { ArrayOutputNode, EmptyInputsNode, InputNode, LinkConnectorNode, ObjectOutputNode } from "../components/Diagram/Node";
import { DataMapperNodeModel } from "../components/Diagram/Node/commons/DataMapperNode";
import { DataMapperContext } from "../utils/DataMapperContext/DataMapperContext";
import { IDMModel, IOType, Mapping, TypeKind } from "@wso2-enterprise/ballerina-core";
import { OFFSETS } from "../components/Diagram/utils/constants";
import { BaseVisitor } from "./BaseVisitor";

export class NodeInitVisitor implements BaseVisitor {
    private inputNodes: DataMapperNodeModel[] = [];
    private outputNode: DataMapperNodeModel;
    private intermediateNodes: DataMapperNodeModel[] = [];

    constructor(
        private context: DataMapperContext,
    ){}

    beginVisitInputType(node: IOType, parent?: IDMModel): void {
        // Create input node
        const inputNode = new InputNode(this.context, node);
        inputNode.setPosition(0, 0);
        this.inputNodes.push(inputNode);
    }

    beginVisitOutputType(node: IOType, parent?: IDMModel): void {
        // Create output node
        if (node.kind === TypeKind.Record) {
            this.outputNode = new ObjectOutputNode(this.context, node);
        } else if (node.kind === TypeKind.Array) {
            this.outputNode = new ArrayOutputNode(this.context, node);
        }
        // TODO: Handle other types
        this.outputNode.setPosition(OFFSETS.TARGET_NODE.X, OFFSETS.TARGET_NODE.Y);
    }

    beginVisitMapping(node: Mapping, parentMapping: Mapping, parentModel?: IDMModel): void {
        // Create link connector node
        if (node.inputs.length > 1 || node.isComplex || node.isFunctionCall) {
            // Create intermediate node
            const intermediateNode = new LinkConnectorNode(this.context, node);
            this.intermediateNodes.push(intermediateNode);
        }
    }

    getNodes() {
        if (this.inputNodes.length === 0) {
            this.inputNodes.push(new EmptyInputsNode());
        }
        const nodes = [...this.inputNodes, this.outputNode];
        nodes.push(...this.intermediateNodes);
        return nodes;
    }
}
