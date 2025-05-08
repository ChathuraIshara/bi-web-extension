/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    TypeDefinition,
    Visitor
} from "@wso2-enterprise/syntax-tree";


const typeDefinitions: Map<string, TypeDefinition> = new Map();

class RecordsFinderVisitor implements Visitor {

    isReturn: boolean = false;
    public beginVisitReturnTypeDescriptor() {
        this.isReturn = true;
    }

    public beginVisitTypeDefinition(node: TypeDefinition): void {
        if (this.isReturn) {
            typeDefinitions.set(node.typeName?.value, node);
        }
    }

    getRecords(): Map<string, TypeDefinition> {
        return typeDefinitions;
    }
}

export const visitor = new RecordsFinderVisitor();
