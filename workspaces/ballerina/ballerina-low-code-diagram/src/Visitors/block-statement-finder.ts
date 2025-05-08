/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { BlockStatement, Visitor } from "@wso2-enterprise/syntax-tree";

export class BlockStatementFinder implements Visitor {
    public haveBlockStatement: boolean = false;
    constructor() {
        this.haveBlockStatement = false;
    }

    public beginVisitBlockStatement(node: BlockStatement) {
        this.haveBlockStatement = true;
    }

    public getHaveBlockStatement(): boolean {
        return this.haveBlockStatement;
    }
}
