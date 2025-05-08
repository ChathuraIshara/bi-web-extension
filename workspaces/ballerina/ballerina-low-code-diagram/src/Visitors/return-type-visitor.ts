/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    ErrorTypeDesc,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";

class ReturnTypeVisitor implements Visitor {
    private errorNode: STNode = undefined;

    public beginVisitErrorTypeDesc(node: ErrorTypeDesc, parent?: STNode) {
            this.errorNode = node;
    }

    hasError(): boolean {
        const hasError = this.errorNode !== undefined;
        this.errorNode = undefined;
        return hasError;
    }
}

export const returnTypeVisitor = new ReturnTypeVisitor();
