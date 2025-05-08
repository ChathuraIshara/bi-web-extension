/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodeTypes } from "../../../resources/constants";
import { BaseNodeModel } from "../BaseNode";

export class ContainerNodeModel extends BaseNodeModel {
    protected visible: boolean;
    readonly breakpointPercent: number;
    readonly label: string;

    constructor(id: string, width?: number, height?: number, breakpointPercent?: number, label?: string) {
        super({
            id,
            type: NodeTypes.CONTAINER_NODE,
        });
        this.width = width;
        this.height = height;
        this.breakpointPercent = breakpointPercent || 0;
        this.label = label || "";
    }

    isVisible(): boolean {
        return this.visible;
    }
}
