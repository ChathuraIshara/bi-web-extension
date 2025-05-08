/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Point } from "@projectstorm/geometry";
import { DefaultPortModel } from "@projectstorm/react-diagrams";
import { CallExpression } from "ts-morph";

import { DataMapperNodeModel } from "../commons/DataMapperNode";
import { ArrowLinkModel } from "../../Link";
import { FocusedInputNode } from "../FocusedInput";
import { getFilterExpressions } from "../../utils/common-utils";

export const ARRAY_FILTER_NODE_TYPE = "datamapper-node-array-filter";
const NODE_ID = "array-filter-node";

export class ArrayFilterNode extends DataMapperNodeModel {

    public x: number;
    public y: number;
    public sourcePort: DefaultPortModel;
    public targetPort: DefaultPortModel;
    public filterExpressions: CallExpression[];
    public noOfFilters: number;

    constructor(
        public focusedInputNode: FocusedInputNode
    ) {
        const context = focusedInputNode.context;
        super(
            NODE_ID,
            context,
            ARRAY_FILTER_NODE_TYPE
        );
        this.filterExpressions = getFilterExpressions(focusedInputNode.value);
        this.noOfFilters = this.filterExpressions.length;
    }

    initPorts() {
        this.sourcePort = new DefaultPortModel(false, ARRAY_FILTER_NODE_TYPE)
        this.addPort(this.sourcePort);
    }

    initLinks() {
        const lm = new ArrowLinkModel();
        lm.setSourcePort(this.sourcePort);
        lm.setTargetPort(this.targetPort);
        this.getModel().addAll(lm);
    }

    setPosition(point: Point): void;
    setPosition(x: number, y: number): void;
    setPosition(x: unknown, y?: unknown): void {
        if (typeof x === 'number' && typeof y === 'number') {
            if (!this.x || !this.y) {
                this.x = x;
                this.y = y;
            }
            super.setPosition(x, y);
        }
    }
}
