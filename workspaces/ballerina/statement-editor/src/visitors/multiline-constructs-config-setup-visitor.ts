/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    LetClause,
    MappingConstructor, QueryPipeline,
    STKindChecker,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";

import { StatementEditorViewState } from "../utils/statement-editor-viewstate";

class MultilineConstructsConfigSetupVisitor implements Visitor {
    public beginVisitSTNode(node: STNode, parent?: STNode) {
        if (parent && (parent.viewState as StatementEditorViewState).multilineConstructConfig.isFieldWithNewLine) {
            (node.viewState as StatementEditorViewState).multilineConstructConfig.isFieldWithNewLine = true;
        }
    }

    public beginVisitMappingConstructor(node: MappingConstructor, parent?: STNode) {
        node.fields.map((field: STNode, index: number) => {
            if (node.fields.length - 1 === index) {
                (field.viewState as StatementEditorViewState).multilineConstructConfig.isFieldWithNewLine = true;
            }
        });
        if (node.openBrace.position.endLine !== node.closeBrace.position.startLine) {
            (node.closeBrace.viewState as StatementEditorViewState)
                .multilineConstructConfig.isClosingBraceWithNewLine = true;
        }
        if (parent && (STKindChecker.isSpecificField(parent) || STKindChecker.isComputedNameField(parent))) {
            (node.closeBrace.viewState as StatementEditorViewState)
                .multilineConstructConfig.isFieldWithNewLine = true;
        }
    }

    public beginVisitQueryPipeline(node: QueryPipeline, parent?: STNode) {
        (node.fromClause.viewState as StatementEditorViewState).multilineConstructConfig.isFieldWithNewLine = true;
        node.intermediateClauses.map((clause: STNode, index: number) => {
            (clause.viewState as StatementEditorViewState).multilineConstructConfig.isFieldWithNewLine = true;
        })
    }
}

export const visitor = new MultilineConstructsConfigSetupVisitor();
