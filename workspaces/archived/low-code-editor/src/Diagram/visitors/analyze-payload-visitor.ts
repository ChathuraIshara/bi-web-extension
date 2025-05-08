/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    BlockStatement,
    CheckExpression,
    ElseBlock,
    FunctionDefinition,
    LocalVarDecl,
    RemoteMethodCallAction,
    STKindChecker,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";

import AnalyzerPayload from "./AnalyzerPayload";

export class AnalyzePayloadVisitor implements Visitor {
    private analyzerPayload = new AnalyzerPayload();

    public beginVisitLocalVarDecl(node: LocalVarDecl) {
        if ((node.initializer as CheckExpression).typeData.isEndpoint) {
            this.analyzerPayload.pushEndPointNode(node);
        }
    }

    public beginVisitRemoteMethodCallAction(node: RemoteMethodCallAction) {
        this.analyzerPayload.pushActionNode(node);
    }

    public beginVisitElseBlock(node: ElseBlock) {
        if (STKindChecker.isIfElseStatement(node.elseBody)) {
            this.analyzerPayload.pushElseBranch();
        }
    }
    public endVisitElseBlock(node: ElseBlock) {
        if (STKindChecker.isIfElseStatement(node.elseBody)) {
            this.analyzerPayload.popBranch();
        }
    }

    public beginVisitBlockStatement(node: BlockStatement, parent?: STNode) {
        this.analyzerPayload.pushBody();
        if (STKindChecker.isElseBlock(parent)) {
            this.analyzerPayload.pushElseBranch();
        } else if (STKindChecker.isIfElseStatement(parent)) {
            this.analyzerPayload.pushIfBranch();
        } else if (STKindChecker.isWhileStatement(parent) || STKindChecker.isForeachStatement(parent)) {
            this.analyzerPayload.pushForBranch(parent);
        }
    }

    public endVisitBlockStatement(node: BlockStatement, parent?: STNode) {
        if (STKindChecker.isElseBlock(parent) || STKindChecker.isIfElseStatement(parent)
            || STKindChecker.isWhileStatement(parent) || STKindChecker.isForeachStatement(parent)) {
            this.analyzerPayload.popBranch();
        }
        this.analyzerPayload.popBody();
    }

    public beginVisitFunctionDefinition(node: FunctionDefinition) {
        this.analyzerPayload.pushBody();
        this.analyzerPayload.addNextNode();
    }

    public getPayload() {
        return this.analyzerPayload.getPayload()
    }

}


