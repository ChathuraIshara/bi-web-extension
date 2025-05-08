/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    FromClause,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";

export class FromClauseBindingPatternFindingVisitor implements Visitor {
    private readonly bindingPatterns: STNode[];

    constructor() {
        this.bindingPatterns = []
    }

    public beginVisitFromClause(node: FromClause) {
        this.bindingPatterns.push(node.typedBindingPattern.bindingPattern);
    }

    public getBindingPatterns(){
        return this.bindingPatterns;
    }
}
