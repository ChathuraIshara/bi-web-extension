/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    FunctionDefinition,
    NodePosition,
    QueryExpression,
    SpecificField,
    STNode,
    Visitor,
} from "@wso2-enterprise/syntax-tree";

import { isPositionsEquals } from "../../../utils/st-utils";

export class QueryParentFindingVisitor implements Visitor {
    private specifField: SpecificField | FunctionDefinition;
    private foundSearchingNode: boolean;

    constructor(private position: NodePosition) {
        this.foundSearchingNode = false
    }

    public endVisitSpecificField(node: SpecificField, parent?: STNode): void {
        if (!this.specifField && this.foundSearchingNode){
            this.specifField = node;
        }
    }

    public endVisitQueryExpression(node: QueryExpression, parent?: STNode): void {
        if (isPositionsEquals(node.position, this.position) && !this.specifField){
            this.foundSearchingNode = true
        }
    }

    public endVisitFunctionDefinition(node: FunctionDefinition, parent?: STNode): void {
        if (!this.specifField && this.foundSearchingNode){
            this.specifField = node;
        }
    }

    public getSpecificField() {
        return this.specifField;
    }
}
