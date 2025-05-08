/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { LinePosition } from "@wso2-enterprise/ballerina-core";
import {
    FunctionCall,
    STKindChecker,
    Visitor
} from "@wso2-enterprise/syntax-tree";

export interface FunctionCallInfo {
    fnPosition: LinePosition;
    fnName: string;
}

export class FunctionCallFindingVisitor implements Visitor {
    private readonly fnCalls: FunctionCallInfo[];

    constructor() {
        this.fnCalls = [];
    }

    public beginVisitFunctionCall(node: FunctionCall) {
        this.fnCalls.push({
            fnPosition: {
                line: node.position.startLine,
                offset: node.position.startColumn
            },
            fnName: STKindChecker.isSimpleNameReference(node.functionName)
                ? node.functionName.name.value
                : node.functionName.identifier.value
        });
    }

    public getFunctionCallPositions(){
        return this.fnCalls.map(fnCall => fnCall.fnPosition);
    }

    public getFunctionCalls(){
        return this.fnCalls;
    }
}
