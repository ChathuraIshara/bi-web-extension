/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { STNode } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { NODE_DIMENSIONS, NodeTypes } from "../../../resources/constants";
import { BaseNodeModel } from "../BaseNodeModel";

export class DataServiceNodeModel extends BaseNodeModel {
    readonly nodeWidth = NODE_DIMENSIONS.DATA_SERVICE.WIDTH;
    readonly nodeHeight = NODE_DIMENSIONS.DATA_SERVICE.HEIGHT;

    constructor(stNode: STNode, name:string, documentUri:string) {
        super(NodeTypes.DATA_SERVICE_NODE, name, documentUri, stNode);
    }
}
