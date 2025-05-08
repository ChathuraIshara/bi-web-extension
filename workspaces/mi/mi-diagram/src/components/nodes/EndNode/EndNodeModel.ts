/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodeModel, PortModelAlignment } from "@projectstorm/react-diagrams";
import { NodePortModel } from "../../NodePort/NodePortModel";
import { STNode } from "@wso2-enterprise/mi-syntax-tree/src";
import { NodeTypes } from "../../../resources/constants";
import { getNodeIdFromModel } from "../../../utils/node";

export class EndNodeModel extends NodeModel {
    protected stNode: STNode;
    protected portIn: NodePortModel;
    protected portOut: NodePortModel;
    protected parentNode: STNode;
    protected prevNodes: STNode[];

    constructor(stNode: STNode, parentNode?: STNode, prevNodes: STNode[] = []) {
        super({
            id: getNodeIdFromModel(stNode),
            type: NodeTypes.END_NODE,
            locked: true,
        });
        this.stNode = stNode;
        this.parentNode = parentNode;
        this.prevNodes = prevNodes;
        this.addInPort("in");
        this.addOutPort("out");
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
}
