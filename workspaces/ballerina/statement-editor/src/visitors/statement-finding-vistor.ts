/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    BlockStatement,
    FunctionBodyBlock,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";

class StatementFindingVisitor implements Visitor {
    private statements: STNode[] = [];

    public beginVisitFunctionBodyBlock(node: FunctionBodyBlock, parent?: STNode) {
            this.statements.push(...node.statements);
    }

    public beginVisitBlockStatement(node: BlockStatement, parent?: STNode) {
        this.statements.push(...node.statements);
    }

    setStatementsNull(): void {
         this.statements = []
    }

    getStatements(): STNode[] {
        return this.statements;
    }
}

export const visitor = new StatementFindingVisitor();
