/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    ClientResourceAccessAction,
    ExplicitNewExpression,
    FunctionCall,
    ImplicitNewExpression,
    MethodCall,
    RemoteMethodCallAction,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";

import { StatementEditorViewState } from "../utils/statement-editor-viewstate";


class ParentFunctionSetupVisitor implements Visitor {
    public beginVisitSTNode(node: STNode, parent?: STNode) {
        if (parent && (parent.viewState as StatementEditorViewState).parentFunctionPos) {
            (node.viewState as StatementEditorViewState).parentFunctionPos = parent.viewState.parentFunctionPos;
        }
    }

    public beginVisitFunctionCall(node: FunctionCall) {
        (node.viewState as StatementEditorViewState).parentFunctionPos = node.position;
    }

    public beginVisitMethodCall(node: MethodCall) {
        (node.viewState as StatementEditorViewState).parentFunctionPos = node.position;
    }

    public beginVisitExplicitNewExpression(node: ExplicitNewExpression) {
        (node.viewState as StatementEditorViewState).parentFunctionPos = node.position;
    }

    public beginVisitImplicitNewExpression(node: ImplicitNewExpression) {
        (node.viewState as StatementEditorViewState).parentFunctionPos = node.position;
    }

    public beginVisitRemoteMethodCallAction(node: RemoteMethodCallAction): void {
        (node.viewState as StatementEditorViewState).parentFunctionPos = node.position;
    }

    public beginVisitClientResourceAccessAction(node: ClientResourceAccessAction): void {
        (node.viewState as StatementEditorViewState).parentFunctionPos = node.position;
    }
}

export const parentFunctionSetupVisitor = new ParentFunctionSetupVisitor();
