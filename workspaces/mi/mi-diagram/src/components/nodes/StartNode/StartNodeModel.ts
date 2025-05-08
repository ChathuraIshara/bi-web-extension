/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PortModelAlignment } from "@projectstorm/react-diagrams";
import { STNode } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { NodePortModel } from "../../NodePort/NodePortModel";
import { NodeTypes } from "../../../resources/constants";
import { BaseNodeModel } from "../BaseNodeModel";
import { getNodeIdFromModel } from "../../../utils/node";

export enum StartNodeType {
    IN_SEQUENCE,
    OUT_SEQUENCE,
    SUB_SEQUENCE,
    FAULT_SEQUENCE   
}
export class StartNodeModel extends BaseNodeModel {
    protected startNodeType: StartNodeType;

    constructor(stNode: STNode, nodeType: StartNodeType, documentUri:string, parentNode?: STNode, prevNodes: STNode[] = []) {
        super(NodeTypes.START_NODE, "Start", documentUri, stNode, parentNode, prevNodes);
        this.startNodeType = nodeType;
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
        const port = new NodePortModel({
            in: true,
            name: "in",
            label: label,
            alignment: PortModelAlignment.TOP,
        });
        super.addPort(port);
        this.portIn = port;
        return port;
    }

    addOutPort(label: string): NodePortModel {
        const port = new NodePortModel({
            in: true,
            name: "out",
            label: label,
            alignment: PortModelAlignment.BOTTOM,
        });
        super.addPort(port);
        this.portOut = port;
        return port;
    }

    getInPort(): NodePortModel {
        return this.portIn;
    }

    getOutPort(): NodePortModel {
        return this.portOut;
    }

    getStNode(): STNode {
        return this.stNode;
    }

    getParentStNode(): STNode {
        return this.parentNode;
    }

    getPrevNodes(): STNode[] {
        return this.prevNodes;
    }

    getStartNodeType(): StartNodeType {
        return this.startNodeType;
    }
}
