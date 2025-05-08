/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Point } from "@projectstorm/geometry";

import { DataMapperNodeModel } from "../commons/DataMapperNode";

export const EMPTY_INPUTS_NODE_TYPE = "data-mapper-node-empty-inputs";
const NODE_ID = "empty-inputs-node";

export class EmptyInputsNode extends DataMapperNodeModel {

    public x: number;
    public y: number;

    constructor() {
        super( 
            `${NODE_ID}`,
            undefined,
            EMPTY_INPUTS_NODE_TYPE
        );
    }

    initPorts() {
        // Ports are not needed
    }

    initLinks(): void {
        // Links are not needed
    }

    public updatePosition() {
        this.setPosition(this.position.x, this.position.y);
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
