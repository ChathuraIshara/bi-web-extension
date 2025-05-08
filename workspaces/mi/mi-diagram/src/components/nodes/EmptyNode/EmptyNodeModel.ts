/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodeTypes } from "../../../resources/constants";
import { BaseNodeModel } from "../BaseNodeModel";
import { STNode } from "@wso2-enterprise/mi-syntax-tree/lib/src";

export class EmptyNodeModel extends BaseNodeModel {
    readonly visible: boolean;
    constructor(stNode: STNode, documentUri:string, visible: boolean = false) {
        super(
            NodeTypes.EMPTY_NODE,
            NodeTypes.EMPTY_NODE,
            documentUri,
            stNode,
        );
        this.visible = visible;
    }
}
