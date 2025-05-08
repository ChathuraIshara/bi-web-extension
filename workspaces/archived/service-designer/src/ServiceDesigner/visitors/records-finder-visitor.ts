/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    NodePosition,
    RecordTypeDesc,
    ReturnTypeDescriptor,
    SimpleNameReference,
    STNode,
    UnionTypeDesc,
    Visitor
} from "@wso2-enterprise/syntax-tree";


const recordTypeDescriptions: Map<string, STNode> = new Map();

class RecordsFinderVisitor implements Visitor {

    public beginVisitReturnTypeDescriptor(node: ReturnTypeDescriptor) {
        const typeData = node.typeData;
        const typeSymbol = typeData.typeSymbol;
        if (typeSymbol?.moduleID) {
            const recordMapKey = `${typeSymbol.moduleID.orgName}/${typeSymbol.moduleID.moduleName}:${typeSymbol.moduleID.version}:${typeSymbol.name}`
            recordTypeDescriptions.set(recordMapKey, node);
        }
    }

    public beginVisitSimpleNameReference(node: SimpleNameReference, parent?: STNode): void {
        if (node.typeData?.symbol?.typeKind === "typeReference") {
            recordTypeDescriptions.set(node.name.value, node);
        }
    }

    getRecords(): Map<string, STNode> {
        return recordTypeDescriptions;
    }
}

export const visitor = new RecordsFinderVisitor();
