/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodeModel } from "@projectstorm/react-diagrams";
import { NodePortModel } from "../../NodePort";
import { NodeTypes } from "../../../resources/constants";
import { Branch, FlowNode, LinePosition } from "@wso2-enterprise/ballerina-core";

export class EndNodeModel extends NodeModel {
    protected portIn: NodePortModel;
    protected portOut: NodePortModel;
    protected parentFlowNode: FlowNode;
    topNode: FlowNode | Branch; // top statement node or parent block node
    target: LinePosition;

    constructor(id: string) {
        super({
            id,
            type: NodeTypes.END_NODE,
            locked: true,
        });
        this.addInPort("in");
    }

    addPort<T extends NodePortModel>(port: T): T {
        super.addPort(port);
        if (port.getOptions().in) {
            this.portIn = port;
        } else {
            this.portOut = port;
        }
        return port;
    }

    addInPort(label: string): NodePortModel {
        const p = new NodePortModel(true, label);
        return this.addPort(p);
    }

    getInPort(): NodePortModel {
        return this.portIn;
    }

    getOutPort(): NodePortModel {
        return this.portOut;
    }

    setParentFlowNode(node: FlowNode): void {
        this.parentFlowNode = node;
    }

    getParentFlowNode(): FlowNode {
        return this.parentFlowNode;
    }

    setTopNode(node: FlowNode | Branch) {
        this.topNode = node;
    }

    getTopNode(): FlowNode | Branch {
        return this.topNode;
    }

    setTarget(target: LinePosition) {
        this.target = target;
    }

    getTarget(): LinePosition {
        return this.target;
    }
}
