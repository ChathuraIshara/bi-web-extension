/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FunctionDefinition, STNode, Visitor } from "@wso2-enterprise/syntax-tree";

export class FunctionFindingVisitor implements Visitor {
    functionName: string;
    functionNode: FunctionDefinition;

    constructor(functionName: string) {
        this.functionName = functionName;
    }

    public beginVisitFunctionDefinition(node: FunctionDefinition, parent?: STNode) {
        if (node.functionName.value === this.functionName) {
            this.functionNode = node;
        }
    }

    public getFunctionNode(): FunctionDefinition {
        return this.functionNode;
    }
}
