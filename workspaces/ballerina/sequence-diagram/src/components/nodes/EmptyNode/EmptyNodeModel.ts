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

export class EmptyNodeModel extends BaseNodeModel {
    protected visible: boolean;

    constructor(id: string, visible = true) {
        super({
            id,
            type: NodeTypes.EMPTY_NODE,
        });
        this.visible = visible;
    }

    isVisible(): boolean {
        return this.visible;
    }
}
